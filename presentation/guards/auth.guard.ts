import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";

@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(
    context: ExecutionContext
  ): Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest();
      const token = request.headers["authorization"]?.split(" ")[1];

      const response = await fetch(process.env.VERIFY_TOKEN_URL || "", {
        method: "POST",
        body: JSON.stringify({ 
          token: token,
          api_key: process.env.ALTERNATIVE_AUTH_API_KEY
        }),
        headers: { "Content-Type": "application/json" }
      })

      if (!response.ok) {
        throw new ForbiddenException('Invalid or expired token');
      }

      const data = await response.json();

      if (!data?.user) {
        throw new ForbiddenException('User not found');
      }

      request.user = data.user;
      return true;
    } catch (error) {
      throw new ForbiddenException('Authentication failed');
    }
  }
}