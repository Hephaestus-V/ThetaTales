// app/hooks/useSubscriptionContract.ts
import {  useWriteContract } from 'wagmi'
import { useReadContract } from 'wagmi'
import { config } from '@/config/config'
import { Abi, isAddress, parseEther } from 'viem'
import {subscriptionABI} from '../abis/subscription'
import { Address} from "viem"

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_SUBSCRIPTION_CONTRACT_ADDRESS as Address

export function useSubscriptionRead(functionName: string,args: Array<any>=[]) {
  const { data, isError, isLoading, refetch } = useReadContract({
    config: config,
    abi: subscriptionABI as Abi,
    address: CONTRACT_ADDRESS,
    functionName: functionName,
    args
  })

  return { data, isError, isLoading, refetch }
}

export function useSubscriptionWrite(functionName:string) {
  const { writeContract,writeContractAsync, ...rest } = useWriteContract({
    config: config,
    mutation:{
        onError: (error)=>{
            console.log(error)
        },
        onSettled(data, error, variables, context) {
            console.log(data)
        },
    }
  })

  const write = async(args: Array<any>=[],value?: string)=> {
    await writeContractAsync({
        abi:subscriptionABI as Abi,
        address:CONTRACT_ADDRESS as Address,
        args,
        functionName,
        value:value ? parseEther(value) : undefined,
    });
  }

  return {write,...rest}
}