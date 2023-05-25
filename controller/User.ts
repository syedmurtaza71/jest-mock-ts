import User from "../models/User";
import service_1 from "../services/service-1"
import {request,response} from "express";
import {ContractFactory,Contract,ContractTransaction,providers,getDefaultProvider, ethers} from "ethers"
import {abi,bytecode} from "../build/Marketplace.json";

const provider = new ethers.providers.JsonRpcProvider('https://eth-sepolia.g.alchemy.com/v2/bVZVBu2Q-j4ndsWUmWIQ8q-yG6I4kuPB');
const wallet = new ethers.Wallet("0212f2f04d54648a022597564463862f91d365d7919318f3b3037a0f9a669ee2",provider);

export default {
    createUser: async (req:typeof request,res:typeof response)=> {

        // Create a factory using the contract ABI and bytecode
        const contractFactory = new ethers.ContractFactory(abi,bytecode, wallet);
        // Deploy the contract
        const contract = await contractFactory.deploy();
        await contract.deployed();
        console.log('Contract deployed:', contract.address);

        const contractor = new ethers.Contract(contract.address,abi,wallet);
        const getListedNft = await contractor.getListedNft("0x72F0c91dfA00Ac94DF16b58294BCa3fc239E9550",123);
        console.log(getListedNft);

        const user = new User({
            name:"11",
            age:33,
            gender:"FF"
        });
       const savedUser = await user.save();
       return res.status(200).json({message:"Saved User",user:savedUser});
    },
    getUser: async (req:typeof request,res:typeof response)=>{
        const id = req.params.id;
        const foundUser = await User.findOne({_id:id});
        await service_1.service_1();
        return res.status(200).json({foundUser});
    }
}