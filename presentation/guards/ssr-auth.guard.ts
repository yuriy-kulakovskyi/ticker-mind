import { 
  BadRequestException, 
  CanActivate, 
  ExecutionContext, 
  ForbiddenException, 
  Injectable, 
  NotFoundException 
} from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { firstValueFrom } from "rxjs";
import { IUserResponse } from "@shared/interfaces/user.interface";

@Injectable()
export class SsrAuthGuard implements CanActivate {
  constructor(private readonly httpService: HttpService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    
    const token = request.cookies?.auth_token;

    if (!token) {
      throw new ForbiddenException(
        "Authorization token missing. Please authenticate via /admin/auth?token=YOUR_TOKEN first"
      );
    }

    try {
      const { data } = await firstValueFrom(
        this.httpService.post<IUserResponse>(process.env.VERIFY_TOKEN_URL || "", {
          token,
          api_key: process.env.ALTERNATIVE_AUTH_API_KEY,
        })
      );

      if (!data?.user || !data.user.user_id) throw new ForbiddenException("User not found");

      request.user = data.user;
      return true;
    } catch (error) {
      switch (error.response?.status) {
        case 400:
          throw new BadRequestException("Bad request to authentication service");
        case 401:
          throw new ForbiddenException("Invalid or expired token");
        case 403:
          throw new ForbiddenException("Access denied");
        case 404:
          throw new NotFoundException("User not found");
        default:
          throw new ForbiddenException("Authentication failed");
      }
    }
  }
}
