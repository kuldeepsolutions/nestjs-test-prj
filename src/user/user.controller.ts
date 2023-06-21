import { Body, Controller, Delete, Get, HttpStatus, Param, Post, UploadedFiles, Put, Req, Res, HttpException } from "@nestjs/common";
import { UserSchema } from "./user.schema";
import { UserService } from "./user.service";
import { JwtService } from '@nestjs/jwt'
@Controller('/api/v1/user')

export class UserController {
    constructor(private userService: UserService, private jwtService: JwtService) { }
    @Post('/register')
    async register(@Body() body, @Res() res) {
        try {
            const user = await this.userService.register(body);
            return res.status(HttpStatus.CREATED).json({
                message: 'User registered successfully',
                user
            })
        } catch (error) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                message: error.message
            })
        }
    }
    @Post('/login')
    async login(@Body() body, @Res() res) {
        try {
            const user = await this.userService.login(body);
            const payload = { email: user.email, fullname: user.fullname,id:user._id };
            const token = await this.jwtService.sign(payload);
            return res.status(HttpStatus.OK).json({
                message: 'User logged in successfully',
                token
            })
        } catch (error) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                message: error.message
            })
        }
    }
    @Get('/:id')
    async getOne(@Param('id') id, @Res() res) {
        try {
            const user = await this.userService.getOne(id);
            return res.status(HttpStatus.OK).json({
                message: 'User fetched successfully',
                user
            })
        } catch (error) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                message: error.message
            })
        }
    }
    @Get('/')
    async getAll(@Res() res) {
        try {
            const users = await this.userService.getAll();
            return res.status(HttpStatus.OK).json({
                message: 'Users fetched successfully',
                users
            })
        } catch (error) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                message: error.message
            })
        }
    }
}
