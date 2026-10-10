import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { AuthModule } from "./modules/auth/auth.module";
import { OrganizationsModule } from "./modules/organizations/organizations.module";
import { ProjectsModule } from "./modules/projects/projects.module";
import { DesignFilesModule } from "./modules/design-files/design-files.module";
import { ArtboardsModule } from "./modules/artboards/artboards.module";
import { LayersModule } from "./modules/layers/layers.module";
import { CommentsModule } from "./modules/comments/comments.module";
import { CollaborationModule } from "./modules/collaboration/collaboration.module";
import { Organization } from "./modules/organizations/organization.entity";
import { User } from "./modules/auth/user.entity";
import { Project } from "./modules/projects/project.entity";
import { DesignFile } from "./modules/design-files/design-file.entity";
import { Artboard } from "./modules/artboards/artboard.entity";
import { LayerNode } from "./modules/layers/layer-node.entity";
import { Comment } from "./modules/comments/comment.entity";
import { DesignToken } from "./modules/design-files/design-token.entity";
import { Asset } from "./modules/design-files/asset.entity";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: "postgres",
        url: config.get<string>("DATABASE_URL") ?? "postgresql://localhost:5432/codesign",
        entities: [Organization, User, Project, DesignFile, Artboard, LayerNode, Comment, DesignToken, Asset],
        synchronize: true,
        logging: false,
      }),
    }),
    AuthModule,
    OrganizationsModule,
    ProjectsModule,
    DesignFilesModule,
    ArtboardsModule,
    LayersModule,
    CommentsModule,
    CollaborationModule,
  ],
})
export class AppModule {}
