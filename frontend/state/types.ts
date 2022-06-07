import {
  JsonRpcProvider,
  StaticJsonRpcProvider,
} from "@ethersproject/providers";

export type SerializedBigNumber = string;

export interface IBaseAsyncThunk {
  readonly provider: StaticJsonRpcProvider | JsonRpcProvider;
}

export interface IBaseAddressAsyncThunk extends IBaseAsyncThunk {
  readonly address: string;
}

export interface IBaseMintNFTAsyncThunk extends IBaseAsyncThunk {
  readonly cid: string;
  readonly amount: string;
}

export interface WhitelistResponse {
  maxLength: SerializedBigNumber;
  length: SerializedBigNumber;
  owner: string;
}
