import supertest from "supertest"
import express from "express";
import userRoutes from "../routes/user";
import mongoose from "mongoose";
import {abi,bytecode,evm} from '../build/Marketplace.json'
import { FakeContract, smock } from '@defi-wonderland/smock';

import {ethers} from "hardhat";
import { MockProvider,deployMockContract,MockContract } from "ethereum-waffle";


// import middleware from "../middleware/User"; // these are imports that are only to check if the mocked were called
// import service1 from "@Service1"; //same 

const app = express();
app.use("/user", userRoutes);
let server:any;
const Provider = new MockProvider();
const [wallet1,wallet2] = new MockProvider().getWallets();
let mockContract: MockContract<any>;
let fakeContract:any;

beforeAll(async () => {
  server = app.listen(3000);
  // mongoose
  // .connect("mongodb+srv://murtazaali:murtazaali@cluster0.fim0bgl.mongodb.net/?retryWrites=true&w=majority",
  // ()=>{
  //   console.log(`DB CONNECTED`);
  // });
  fakeContract =  await smock.fake(abi);
  mockContract = await deployMockContract(wallet1,abi);
 // console.log("Deployed Mock Contract -->",mockContract);
});

jest.mock("../middleware/User",()=>{
  return {
    authenticate: jest.fn((req, res, next) => {
      console.log("Mocker Mocks");
      next(); 
    })
  }
});

jest.mock("../services/service-1",()=>{
  return {
    service_1: jest.fn(() => {
      console.log("I am a 3rd Party Mocked Service");
    }),
  }
});

describe("tests", () => {
  // Add a beforeAll hook to start the server
  test('should return 200',async () => {
    fakeContract.getListedNft.returns({nft:'hello'})

    const mockReturn = {
      collectionAddress: "0x72F0c91dfA00Ac94DF16b58294BCa3fc239E9550",
      nftId:131,
      price:441,
      featuredStatus:true
    }
   const tupleArgument = ["0x72F0c91dfA00Ac94DF16b58294BCa3fc239E9550", 123];
   await mockContract.mock.getListedNft.withArgs("0x72F0c91dfA00Ac94DF16b58294BCa3fc239E9550",123).returns(mockReturn);

   const getListedResponse = await mockContract.getListedNft("0x72F0c91dfA00Ac94DF16b58294BCa3fc239E9550",123);
   
   console.log("listedResponse-->",getListedResponse);
  
   //  const response = await supertest(server).post("/user/create");
  //  expect(response.status).toEqual(200);
  });
});

// Add an afterAll hook to close the server
afterAll(() => {
  server.close();
});