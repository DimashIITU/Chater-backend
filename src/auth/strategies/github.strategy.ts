/* eslint-disable prettier/prettier */

import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-github';
import { AuthService } from '../auth.service';

import * as dotenv from 'dotenv';
dotenv.config();

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor(private readonly authService: AuthService) {
    super({
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: 'http://127.0.0.1:7777/auth/github/callback',
    });
  }
  async validate(accessToken, refreshToken, profile, done) {
    const obj = {
      fullName: profile.displayName,
      avatarUrl: profile.photos?.[0].value,
      userName: profile.username,
    };
    const res = await this.authService.createOAuth(obj);
    done(null, res);
  }
}
