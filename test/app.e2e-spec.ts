import { Test } from "@nestjs/testing"
import { AppModule } from "../src/app.module"
import { INestApplication, ValidationPipe } from "@nestjs/common";
import * as pactum from "pactum";
import { PrismaService } from "../src/prisma/prisma.service";
import { AuthDto } from "../src/auth/dto";

describe(("App e2e test"), () => {
  // declaring app
  let app:INestApplication;
  let prisma: PrismaService;

  beforeAll(async()=>{
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }) .compile()
    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({
      whitelist: true
    }))
    await app.init();
    prisma = app.get(PrismaService)
    prisma.cleanDb()
  pactum.request.setBaseUrl("http://localhost:3333")
  });
  afterAll(async () => {
    await app.close();
  })
  
  describe("Auth", () => {
    describe("signup", () => {
    it("should throw error if email is empty", ()=>{
        return pactum.spec().post(`/auth/signup`).withBody({password: "123456"}).expectStatus(400)
    })
    it("should throw error if password is empty", ()=>{
        return pactum.spec().post(`/auth/signup`).withBody({email: "test1@gmail.com"}).expectStatus(400)
    })
    it("should throw error if no body", ()=>{
        return pactum.spec().post(`/auth/signup`).expectStatus(400)
    })
      it("should signup", ()=>{
        const dto:AuthDto = {
          email: "test@gmail.com",
          password: "123456"
        }
        return pactum.spec().post(`/auth/signup`).withBody(dto).expectStatus(201)
      })
    })

    describe("signin", () => {
      describe("signup", () => {
        it("should throw error if email is empty", ()=>{
            return pactum.spec().post(`/auth/signup`).withBody({password: "123456"}).expectStatus(400)
        })
        it("should throw error if password is empty", ()=>{
            return pactum.spec().post(`/auth/signup`).withBody({email: "test1@gmail.com"}).expectStatus(400)
        })
        it("should throw error if no body", ()=>{
            return pactum.spec().post(`/auth/signup`).expectStatus(400)
        })
        it("should signin", ()=>{
          return pactum.spec().post(`/auth/login`).withBody({email: "test@gmail.com", password: "123456"}).expectStatus(200).stores("userAt","access_token")
        })
      })
    })
  })

  describe("User", () => {
    describe("getMe", () => {
      it("should get current user", ()=>{
        return pactum.spec().get(`/users/me`).withHeaders({
          Authorization: "Bearer $S{userAt}"
        }).expectStatus(200).inspect()
      })      
    })
    describe("editUser", () => {
      
    })
  })

  describe("Bookmark", () => {

    describe("createBookmark", () => {
      
    })

    describe("getBookmarks", () => {
      
    })

    describe("getBookmarkById", () => {
      
    })

    describe("editBookmark", () => {
      
    })

    describe("deleteBookmark", () => {
      
    })
  })
})