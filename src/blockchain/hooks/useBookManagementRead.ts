// app/hooks/useBookManagementRead.ts
import { useReadContract,useWriteContract } from 'wagmi'
import { config } from '@/config/config'
import { Abi ,Address,parseEther} from 'viem'
import { bookManagementABI } from '../abis/bookManagement'


const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_BOOK_MANAGEMENT_CONTRACT_ADDRESS as Address

interface RawBook {
  id: bigint;
  views: bigint;
  ipfsCid: string;
  owner: Address;
}

export function useBookManagementRead(functionName: string) {
  const { data, isError, isLoading, refetch } = useReadContract({
    config: config,
    abi: bookManagementABI as Abi,
    address: CONTRACT_ADDRESS,
    functionName: functionName,
  })

  return { data: data as RawBook[] | undefined, isError, isLoading, refetch }
}

export function useBookManagementWrite(functionName:string) {
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
        abi:bookManagementABI as Abi,
        address:CONTRACT_ADDRESS as Address,
        args,
        functionName,
        value:value ? parseEther(value) : undefined,
    });
  }

  return {write,...rest}
}