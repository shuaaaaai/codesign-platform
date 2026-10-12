import { IsNumber, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class CreateCommentDto {
  @IsString()
  @MinLength(1)
  @MaxLength(500)
  artboardId!: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  authorId?: string;

  @IsString()
  @MinLength(1)
  @MaxLength(1000)
  content!: string;

  @IsNumber()
  x!: number;

  @IsNumber()
  y!: number;
}
