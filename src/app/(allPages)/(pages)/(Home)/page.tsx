"use client";
import {
  ClusttrWorks,
  FirstToKnow,
  Footer,
  Hero,
  InfoSection,
  Navbar,
} from "@/components";
import Image from "next/image";
import { CHAIN_NAMESPACES, IProvider } from "@web3auth/base";
import { Web3Auth } from "@web3auth/modal";
import { useEffect, useState } from "react";
import { SolanaWallet } from "@web3auth/solana-provider";
import { useAppDispatch } from "@/store/hooks";
import {
  Web3Authentication,
  Web3Provider,
  Address,
} from "@/store/service/web3auth";
import RPC from "@/app/solanaRPC";
import { Keypair } from "@solana/web3.js";

export default function Home() {
  const clientId =
    "BEglQSgt4cUWcj6SKRdu5QkOXTsePmMcusG5EAoyjyOYKlVRjIF1iCNnMOTfpzCiunHRrMui8TIwQPXdkQ8Yxuk";
  const [web3auths, setWeb3auth] = useState<Web3Auth | null>(null);
  const [provider, setProvider] = useState<IProvider | null>(null);
  const [account, setAccoiunt] = useState<string>("");

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (web3auths) {
      const init = async () => {
        await dispatch(Web3Authentication(web3auths));
      };
      init();
    }
  }, [web3auths]);

  useEffect(() => {
    if (provider) {
      const init = async () => {
        await dispatch(Web3Provider(provider));
      };
      init();
    }
  }, [provider]);

  useEffect(() => {
    if (account) {
      const init = async () => {
        await dispatch(Address(account));
      };
      init();
    }
  }, [account]);

  const handle = async () => {
    try {
      const web3auth = new Web3Auth({
        clientId,
        web3AuthNetwork: "cyan",
        chainConfig: {
          chainNamespace: CHAIN_NAMESPACES.SOLANA,
          chainId: "0x3",
          rpcTarget: "https://api.devnet.solana.com",
        },
      });
      await web3auth.initModal();

      await web3auth.connect();

      if (web3auth) {
        setWeb3auth(web3auth);
      }

      if (web3auth?.provider) {
        setProvider(web3auth.provider);
        await getPrivateKey();
      }
    } catch (error) {
      console.log(error as TypeError);
    }
  };

  const getPrivateKey = async () => {
    if (provider) {
      const rpc = new RPC(provider);
      const privateKey = await rpc.getPrivateKey();
      console.log({ privateKey });

      const account = await rpc.getAccounts();
      console.log({ account });

      const privateKeyBinary = Uint8Array.from(Buffer.from(privateKey, "hex"));
      const keypair = Keypair.fromSecretKey(privateKeyBinary);
      const publicKey = keypair.publicKey;

      const Pkey = publicKey.toString();
      setAccoiunt(Pkey);

      console.log({ keypair });
    }
  };

  const login = () => {
    handle();
  };

  const unloggedInView = (
    <main className="overflow-hidden">
      <Navbar login={login} />
      <Hero />
      <InfoSection />
      <ClusttrWorks />
      <FirstToKnow />
      <Footer />
    </main>
  );

  return (
    <div>
      <div>{unloggedInView}</div>
    </div>
  );
}