import { Test, TestingModule } from "@nestjs/testing";
import { AuthService } from "./auth.service";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { Roles } from "ffc-prisma-package/dist/client";

describe("AuthService", () => {
  let service: AuthService;
  let configService: ConfigService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService, ConfigService, JwtService],
    }).compile();

    service = module.get<AuthService>(AuthService);
    configService = module.get<ConfigService>(ConfigService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("signinService", () => {
    it("should generate an access token for the service", () => {
      const accessToken = "service-access-token";

      // Mock the ConfigService and JwtService
      jest
        .spyOn(configService, "get")
        .mockReturnValueOnce("issuer-value")
        .mockReturnValueOnce("service-value");
      jest.spyOn(jwtService, "sign").mockReturnValueOnce(accessToken);

      const result = service.signinService();

      expect(configService.get).toHaveBeenCalledWith("issuer");
      expect(configService.get).toHaveBeenCalledWith("service");
      expect(jwtService.sign).toHaveBeenCalledWith(
        {
          iss: "issuer-value",
          aud: "*",
          sub: "service-value",
        },
        {
          algorithm: "RS256",
          expiresIn: "60s",
          privateKey: expect.anything(),
        }
      );
      expect(result).toEqual({ access_token: accessToken });
    });
  });

  describe("generateUserToken", () => {
    it("should generate an access token for a user with the specified user ID and role", () => {
      const userId = 1;
      const userRole = Roles.USER;
      const accessToken = "user-access-token";

      // Mock the ConfigService and JwtService
      jest.spyOn(configService, "get").mockReturnValueOnce("issuer-value");
      jest.spyOn(jwtService, "sign").mockReturnValueOnce(accessToken);

      const result = service.generateUserToken(userId, userRole);

      expect(configService.get).toHaveBeenCalledWith("issuer");
      expect(jwtService.sign).toHaveBeenCalledWith(
        {
          iss: "issuer-value",
          aud: "*",
          sub: userId,
          role: userRole,
        },
        {
          algorithm: "RS256",
          expiresIn: "7d",
          privateKey: expect.anything(),
        }
      );
      expect(result).toEqual({ access_token: accessToken });
    });
  });
});
