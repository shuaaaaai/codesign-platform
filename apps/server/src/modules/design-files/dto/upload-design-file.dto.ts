import { IsOptional, IsString, MaxLength } from "class-validator";

export class UploadDesignFileDto {
  @IsString()
  @MaxLength(255)
  projectId!: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  userId?: string;
}
