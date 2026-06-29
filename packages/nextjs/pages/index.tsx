import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import type { NextPage } from "next";
import { useTheme } from "next-themes";
import Select, { SingleValue } from "react-select";
import { Abi, Address, isAddress } from "viem";
import { gnosis } from "viem/chains";
import { usePublicClient } from "wagmi";
import { ChevronLeftIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { MetaHeader } from "~~/components/MetaHeader";
import { MiniFooter } from "~~/components/MiniFooter";
import { NetworksDropdown } from "~~/components/NetworksDropdown/NetworksDropdown";
import { SwitchTheme } from "~~/components/SwitchTheme";
import { AddressInput } from "~~/components/scaffold-eth";
import { PRESET_ABIS } from "~~/contracts/evidenzAbis";
import useFetchContractAbi from "~~/hooks/useFetchContractAbi";
import { useHeimdall } from "~~/hooks/useHeimdall";
import { useGlobalState } from "~~/services/store/store";
import { parseAndCorrectJSON } from "~~/utils/abi";
import { getAlchemyHttpUrl, notification } from "~~/utils/scaffold-eth";

enum TabName {
  verifiedContract,
  addressAbi,
}

const tabValues = Object.values(TabName) as TabName[];

type PresetOption = { value: string; label: string; address: string; chainId: number };

const PRESET_GROUPS: { label: string; options: PresetOption[] }[] = [
  {
    label: "Production",
    options: [
      {
        value: "p-is-gno",
        label: "EvidenZIssuers — Gnosis",
        address: "0x09016EF58B53510B40835e1F4938EE74bB167e05",
        chainId: 100,
      },
      {
        value: "p-st-avax",
        label: "EvidenZStorage — Avalanche",
        address: "0x5bC445bbB32f75B9b09B68413d2042D3b87bEf8A",
        chainId: 43114,
      },
      {
        value: "p-st-bsc",
        label: "EvidenZStorage — BSC",
        address: "0x2E13439BACF550B0753699f6811405c0100C7F28",
        chainId: 56,
      },
      {
        value: "p-st-gno",
        label: "EvidenZStorage — Gnosis",
        address: "0x2e9e949f19d068b8f6be46136e496f7cdbf5f4ba",
        chainId: 100,
      },
    ],
  },
  {
    label: "Staging",
    options: [
      {
        value: "s-is-gno",
        label: "EvidenZIssuers — Gnosis",
        address: "0x52133D1D361AeD29434C58433346f3FD234374eE",
        chainId: 100,
      },
      {
        value: "s-st-fuji",
        label: "EvidenZStorage — Fuji",
        address: "0xeDa530Fd0539aCf9c86Be0b3a34cEE5851af3503",
        chainId: 43113,
      },
      {
        value: "s-st-bsct",
        label: "EvidenZStorage — BSC Testnet",
        address: "0xeecD1504879b31E9EC75fcc720Adbd723FC5D2B4",
        chainId: 97,
      },
    ],
  },
  {
    label: "Demo",
    options: [
      {
        value: "d-is-gno",
        label: "EvidenZIssuers — Gnosis",
        address: "0xFf3c86478A2E97969b7E33970102D7F5043b4447",
        chainId: 100,
      },
      {
        value: "d-st-fuji",
        label: "EvidenZStorage — Fuji",
        address: "0x5bC445bbB32f75B9b09B68413d2042D3b87bEf8A",
        chainId: 43113,
      },
      {
        value: "d-st-bsct",
        label: "EvidenZStorage — BSC Testnet",
        address: "0xAAEeb4e9160D02137b1E1766666f5f06400345cf",
        chainId: 97,
      },
    ],
  },
];

const Home: NextPage = () => {
  const [activeTab, setActiveTab] = useState(TabName.verifiedContract);
  const [network, setNetwork] = useState(gnosis.id.toString());
  const [verifiedContractAddress, setVerifiedContractAddress] = useState("");
  const [localAbiContractAddress, setLocalAbiContractAddress] = useState("");
  const [localContractAbi, setLocalContractAbi] = useState("");
  const [presetKey, setPresetKey] = useState(0);
  const [presetChainId, setPresetChainId] = useState<number | undefined>(undefined);
  const [presetAbi, setPresetAbi] = useState<Abi | null>(null);

  const router = useRouter();
  const { resolvedTheme } = useTheme();
  const isDarkMode = resolvedTheme === "dark";

  const publicClient = usePublicClient({
    chainId: parseInt(network),
  });

  const { setContractAbi, setAbiContractAddress, setImplementationAddress } = useGlobalState(state => ({
    setContractAbi: state.setContractAbi,
    setAbiContractAddress: state.setAbiContractAddress,
    setImplementationAddress: state.setImplementationAddress,
  }));

  const {
    contractData,
    error,
    isLoading: isFetchingAbi,
    implementationAddress,
  } = useFetchContractAbi({ contractAddress: verifiedContractAddress, chainId: parseInt(network) });

  const { abi: heimdallAbi, isLoading: isHeimdallFetching } = useHeimdall({
    contractAddress: localAbiContractAddress as Address,
    rpcUrl: getAlchemyHttpUrl(parseInt(network))
      ? getAlchemyHttpUrl(parseInt(network))
      : publicClient?.chain.rpcUrls.default.http[0],
    disabled: network === "31337" || !localAbiContractAddress,
  });

  const isAbiAvailable = contractData?.abi && contractData.abi.length > 0;

  const handleFetchError = useCallback(async () => {
    try {
      const bytecode = await publicClient?.getBytecode({
        address: verifiedContractAddress as Address,
      });
      const isContract = Boolean(bytecode) && bytecode !== "0x";

      if (isContract) {
        setLocalAbiContractAddress(verifiedContractAddress);
        setActiveTab(TabName.addressAbi);
      } else {
        notification.error("Address is not a contract, are you sure you are on the correct chain?");
      }
    } catch (error) {
      console.error("Error checking if address is a contract:", error);
      // RPC unreachable — fall through to manual ABI entry
      setLocalAbiContractAddress(verifiedContractAddress);
      setActiveTab(TabName.addressAbi);
    }
  }, [publicClient, verifiedContractAddress, setLocalAbiContractAddress, setActiveTab]);

  useEffect(() => {
    if (implementationAddress) {
      setImplementationAddress(implementationAddress);
    }

    if (contractData?.abi) {
      setContractAbi(contractData.abi);
    }

    if (network === "31337" && isAddress(verifiedContractAddress)) {
      setActiveTab(TabName.addressAbi);
      setLocalAbiContractAddress(verifiedContractAddress);
      return;
    }

    if (error && isAddress(verifiedContractAddress)) {
      if (presetAbi) {
        setContractAbi(presetAbi);
        router.push(`/${verifiedContractAddress}/${network}`);
      } else {
        handleFetchError();
      }
    }
  }, [
    contractData,
    error,
    implementationAddress,
    network,
    verifiedContractAddress,
    handleFetchError,
    setContractAbi,
    setImplementationAddress,
    presetAbi,
    router,
  ]);

  useEffect(() => {
    if (router.pathname === "/") {
      setContractAbi([]);
      setImplementationAddress("");
    }
  }, [router.pathname, setContractAbi, setImplementationAddress]);

  const handleLoadContract = () => {
    if (presetAbi) {
      setContractAbi(presetAbi);
      router.push(`/${verifiedContractAddress}/${network}`);
      return;
    }
    if (isAbiAvailable) {
      router.push(`/${verifiedContractAddress}/${network}`);
    }
  };

  const handlePresetSelect = (option: SingleValue<PresetOption>) => {
    if (!option) {
      setPresetAbi(null);
      return;
    }
    setVerifiedContractAddress(option.address);
    setNetwork(option.chainId.toString());
    setPresetChainId(option.chainId);
    setPresetKey(k => k + 1);
    setPresetAbi(PRESET_ABIS[option.value] ?? null);
  };

  const handleUserProvidedAbi = () => {
    if (!localContractAbi) {
      notification.error("Please provide an ABI.");
      return;
    }
    try {
      const parsedAbi = parseAndCorrectJSON(localContractAbi);
      setContractAbi(parsedAbi);
      router.push(`/${localAbiContractAddress}/${network}`);
      notification.success("ABI successfully loaded.");
    } catch (error) {
      notification.error("Invalid ABI format. Please ensure it is a valid JSON.");
    }
  };

  const selectTheme = (theme: any) => ({
    ...theme,
    colors: {
      ...theme.colors,
      primary25: isDarkMode ? "#0A3D38" : "#E6FDFA",
      primary50: isDarkMode ? "#0D5048" : "#9AF5EC",
      primary: isDarkMode ? "#00E5CC" : "#00A896",
      neutral0: isDarkMode ? "#0D1918" : theme.colors.neutral0,
      neutral80: isDarkMode ? "#ffffff" : theme.colors.neutral80,
    },
  });

  const selectStyles = {
    control: (provided: any) => ({ ...provided, borderRadius: 12 }),
    indicatorSeparator: (provided: any) => ({ ...provided, display: "none" }),
    menu: (provided: any) => ({
      ...provided,
      border: `1px solid ${isDarkMode ? "#555555" : "#a3a3a3"}`,
      zIndex: 20,
    }),
  };

  return (
    <>
      <MetaHeader />
      <div className="flex flex-grow items-center justify-center bg-base-100">
        <div
          className={`flex h-screen bg-base-200 relative overflow-x-hidden w-full flex-col items-center justify-center rounded-2xl pb-4 lg:h-[650px] lg:w-[450px] lg:justify-between lg:shadow-xl`}
        >
          <div className="flex-grow flex flex-col items-center justify-center lg:w-full">
            {tabValues.map(tabValue => (
              <div
                key={tabValue}
                className={`absolute flex flex-col justify-center inset-0 w-full transition-transform duration-300 ease-in-out px-1 ${
                  activeTab === tabValue
                    ? "translate-x-0"
                    : activeTab < tabValue
                    ? "translate-x-full"
                    : "-translate-x-full"
                }`}
              >
                {tabValue === TabName.verifiedContract ? (
                  <div className="my-8 flex flex-col items-center justify-center">
                    <Image src="/Ǝvidenz.png" alt="3videnZ logo" width={119} height={87} className="mb-4" />{" "}
                    <h2 className="mb-0 text-2xl font-bold text-center">3videnZ EVM Blockchains Explorer</h2>
                    <p className="mb-2">Interact with smart contracts on any EVM chain</p>
                    {/* Preset contract selector */}
                    <div className="w-10/12 mt-2">
                      <Select<PresetOption, false, { label: string; options: PresetOption[] }>
                        placeholder="Select a preset contract..."
                        options={PRESET_GROUPS}
                        onChange={handlePresetSelect}
                        isClearable
                        instanceId="preset-select"
                        className="text-sm"
                        theme={selectTheme}
                        styles={selectStyles}
                      />
                    </div>
                    {/* Divider */}
                    <div className="flex items-center w-10/12 my-3 gap-2">
                      <div className="flex-1 border-t border-base-content/20" />
                      <span className="text-xs text-base-content/40 uppercase tracking-widest">ou</span>
                      <div className="flex-1 border-t border-base-content/20" />
                    </div>
                    {/* Network + address manual entry */}
                    <div id="react-select-container">
                      <NetworksDropdown
                        key={presetKey}
                        onChange={option => setNetwork(option ? option.value.toString() : "")}
                        defaultChainId={presetChainId}
                      />
                    </div>
                    <div className="w-10/12 my-4">
                      <AddressInput
                        placeholder="Contract address"
                        value={verifiedContractAddress}
                        onChange={setVerifiedContractAddress}
                      />
                    </div>
                    <button
                      className="btn btn-primary min-h-fit h-10 px-4 text-base font-semibold border-2 hover:bg-neutral hover:text-primary"
                      onClick={handleLoadContract}
                      disabled={!presetAbi && !isAbiAvailable}
                    >
                      {!presetAbi && isFetchingAbi ? (
                        <span className="loading loading-spinner"></span>
                      ) : (
                        "Load contract"
                      )}
                    </button>
                  </div>
                ) : (
                  <div className="flex w-full flex-col items-center gap-3 p-6">
                    <div className="flex justify-center mb-6">
                      <button
                        className="btn btn-ghost absolute left-4 px-2 btn-primary"
                        onClick={() => {
                          setActiveTab(TabName.verifiedContract);
                          setVerifiedContractAddress("");
                        }}
                      >
                        <ChevronLeftIcon className="h-4 w-4" />
                        Go back
                      </button>
                      <Image src="/Ǝvidenz.png" alt="3videnZ logo" width={64} height={64} className="mb-2" />
                    </div>

                    <div className="flex flex-col items-center w-4/5 border-b-2 pb-8">
                      <div className="flex justify-center items-center gap-1">
                        <MagnifyingGlassIcon className="h-5 w-5" />
                        <h1 className="font-semibold text-lg mb-0">Contract not verified</h1>
                      </div>
                      <p className="bg-neutral px-2 rounded-md  text-sm shadow-sm">{localAbiContractAddress}</p>
                      <h4 className="text-center mb-6 font-semibold leading-tight">
                        You can decompile the contract (beta) or import the ABI manually below.
                      </h4>
                      <button
                        className="btn btn-primary min-h-fit h-10 px-4 text-base font-semibold border-2 hover:bg-neutral hover:text-primary"
                        onClick={async () => {
                          if (heimdallAbi) {
                            setContractAbi(heimdallAbi);
                            setAbiContractAddress(localAbiContractAddress as Address);
                            router.push(`/${localAbiContractAddress}/${network}`);
                          }
                        }}
                        disabled={network === "31337" || isHeimdallFetching}
                      >
                        {isHeimdallFetching ? (
                          <div className="flex items-center gap-2">
                            <span className="loading loading-spinner loading-xs"></span>
                            <span>Decompiling contract...</span>
                          </div>
                        ) : (
                          "Decompile (beta)"
                        )}
                      </button>
                    </div>
                    <div className="w-full flex flex-col items-center gap-2">
                      <h1 className="mt-2 font-semibold text-lg">Manually import ABI</h1>
                      <textarea
                        className="textarea bg-neutral w-4/5 h-24 mb-4 resize-none"
                        placeholder="Paste contract ABI in JSON format here"
                        value={localContractAbi}
                        onChange={e => setLocalContractAbi(e.target.value)}
                      ></textarea>
                      <button
                        className="btn btn-primary min-h-fit h-10 px-4 mb-2 text-base font-semibold border-2 hover:bg-neutral hover:text-primary"
                        onClick={handleUserProvidedAbi}
                      >
                        Import ABI
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
          <SwitchTheme className="absolute top-5 right-5" />
          <MiniFooter />
        </div>
      </div>
    </>
  );
};

export default Home;
