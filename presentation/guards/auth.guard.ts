import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { firstValueFrom } from "rxjs";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly httpService: HttpService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers["authorization"]?.split("Bearer ")[1];

    if (!token) throw new ForbiddenException("Authorization token missing");

    try {
      const { data } = await firstValueFrom(
        this.httpService.post(process.env.VERIFY_TOKEN_URL || "", {
          token,
          api_key: process.env.ALTERNATIVE_AUTH_API_KEY,
        })
      );

      if (!data?.user || !data.user.user_id) throw new ForbiddenException("User not found");

      request.user = data.user;
      return true;
    } catch (error) {
      if (error.response?.status === 401)
        throw new ForbiddenException("Invalid or expired token");

      throw new ForbiddenException("Authentication failed");
    }
  }
}