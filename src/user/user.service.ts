import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User, UserDocument } from "./user.schema";
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class UserService {
    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>){}
    async register(body){
        try {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(body.password, salt);
            const user = await this.userModel.create({
                ...body,
                password: hashedPassword
            });
            return user;
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
    }
    async login(body){
        try {
            console.log(body)
            if(!body.email || !body.password){
                throw new HttpException('Missing credentials', HttpStatus.BAD_REQUEST);
            }
            const user = await this.userModel.findOne({email: body.email});
            if(user){
                const isMatch = await bcrypt.compare(body.password, user.password);
                if(isMatch){
                    return user;
                }else{
                    throw new HttpException('Invalid credentials', HttpStatus.BAD_REQUEST);
                }
            }else{
                throw new HttpException('Invalid credentials', HttpStatus.BAD_REQUEST);
            }
        }
        catch (error) {
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
    }
    async getOne(email){
        try {
            const user = await this.userModel.findOne({email});
            return user;
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
    }
    async getAll(){
        try {
            const users = await this.userModel.find({isDeleted: false});
            return users;
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
    }
}

