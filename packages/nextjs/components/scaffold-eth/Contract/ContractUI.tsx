import { useEffect, useMemo, useReducer, useState } from "react";
import { useRouter } from "next/router";
import { ContractReadMethods } from "./ContractReadMethods";
import { ContractVariables } from "./ContractVariables";
import { ContractWriteMethods } from "./ContractWriteMethods";
import { AbiFunction } from "abitype";
import { Abi, Address as AddressType } from "viem";
import { ArrowTopRightOnSquareIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { MiniFooter } from "~~/components/MiniFooter";
import {
  Address,
  Balance,
  MethodSelector,
  getFunctionInputKey,
  transformAbiFunction,
} from "~~/components/scaffold-eth";
import { PRESET_LABEL_BY_ADDRESS } from "~~/contracts/evidenzAbis";
import { useAccountBalance } from "~~/hooks/scaffold-eth";
import useFetchContractCreationInfo from "~~/hooks/useFetchContractCreationInfo";
import { useGlobalState } from "~~/services/store/store";
import { getBlockExplorerTxLink, getTargetNetworks } from "~~/utils/scaffold-eth";

type ContractUIProps = {
  className?: string;
  initialContractData: { address: AddressType; abi: Abi };
};

export interface AugmentedAbiFunction extends AbiFunction {
  uid: string;
}

const augmentMethodsWithUid = (methods: AbiFunction[]): AugmentedAbiFunction[] => {
  // Group methods by their name to identify overloaded functions
  const methodsByName: Record<string, AbiFunction[]> = {};
  methods.forEach(method => {
    if (!methodsByName[method.name]) {
      methodsByName[method.name] = [];
    }
    methodsByName[method.name].push(method);
  });

  // Process each method, adding UID with index only for overloaded functions
  const augmentedMethods: AugmentedAbiFunction[] = [];
  Object.entries(methodsByName).forEach(([, group]) => {
    if (group.length > 1) {
      // overloaded methods
      group.forEach((method, index) => {
        augmentedMethods.push({
          ...method,
          uid: `${method.name}_${index}`,
        });
      });
    } else {
      // regular methods
      augmentedMethods.push({
        ...group[0],
        uid: group[0].name,
      });
    }
  });

  return augmentedMethods;
};

const mainNetworks = getTargetNetworks();

/**
 * UI component to interface with deployed contracts.
 **/
export const ContractUI = ({ className = "", initialContractData }: ContractUIProps) => {
  const [refreshDisplayVariables, triggerRefreshDisplayVariables] = useReducer(value => !value, false);
  const { implementationAddress, chainId } = useGlobalState(state => ({
    chainId: state.targetNetwork.id,
    implementationAddress: state.implementationAddress,
  }));
  const mainNetwork = mainNetworks.find(network => network.id === chainId);
  const { balance: contractBalance, isLoading: isBalanceLoading } = useAccountBalance(initialContractData.address);
  const router = useRouter();
  const { network } = router.query as { network?: string };

  const { contractCreationInfo, isLoading: isContractCreationLoading } = useFetchContractCreationInfo({
    contractAddress: initialContractData.address,
    chainId,
  });

  const updateUrlWithSelectedMethods = (selectedMethods: string[]) => {
    const currentQuery = new URLSearchParams(window.location.search);
    if (selectedMethods.length > 0) {
      currentQuery.set("methods", selectedMethods.join(","));
    } else {
      currentQuery.delete("methods");
    }
    const newPath = `/${initialContractData.address}/${network}`;

    router.push({ pathname: newPath, query: currentQuery.toString() }, undefined, { shallow: true });
  };

  const readMethodsWithInputsAndWriteMethods = useMemo(() => {
    return augmentMethodsWithUid(
      initialContractData.abi.filter((method): method is AbiFunction => {
        if (method.type !== "function") return false;
        if (method.stateMutability === "view" || method.stateMutability === "pure") {
          return method.inputs.length > 0;
        } else {
          return true;
        }
      }),
    );
  }, [initialContractData.abi]);

  // local abi state for for dispalying selected methods
  const [abi, setAbi] = useState<AugmentedAbiFunction[]>([]);
  const [initialParamsByMethod, setInitialParamsByMethod] = useState<Record<string, Record<string, string>>>({});

  const handleMethodSelect = (uid: string) => {
    const methodToAdd = readMethodsWithInputsAndWriteMethods.find(method => method.uid === uid);

    if (methodToAdd && !abi.some(method => method.uid === uid)) {
      const updatedAbi = [...abi, methodToAdd];
      setAbi(updatedAbi);
      updateUrlWithSelectedMethods(updatedAbi.map(m => m.uid));
    }
  };

  const removeMethod = (uid: string) => {
    const updatedAbi = abi.filter(method => method.uid !== uid);

    setAbi(updatedAbi);
    updateUrlWithSelectedMethods(updatedAbi.map(m => m.uid));
  };

  useEffect(() => {
    const selectedMethodNames = (router.query.methods as string)?.split(",") || [];
    const selectedMethods = readMethodsWithInputsAndWriteMethods.filter(method =>
      selectedMethodNames.includes(method.uid),
    );
    setAbi(selectedMethods as AugmentedAbiFunction[]);

    const paramsByMethod: Record<string, Record<string, string>> = {};
    selectedMethods.forEach(method => {
      const transformed = transformAbiFunction(method);
      transformed.inputs.forEach((input, index) => {
        const urlValue = router.query[`${method.uid}.${index}`] as string | undefined;
        if (urlValue !== undefined) {
          const formKey = getFunctionInputKey(method.name, input, index);
          if (!paramsByMethod[method.uid]) paramsByMethod[method.uid] = {};
          paramsByMethod[method.uid][formKey] = urlValue;
        }
      });
    });
    setInitialParamsByMethod(paramsByMethod);
  }, [router.query, readMethodsWithInputsAndWriteMethods]);

  const presetLabel = PRESET_LABEL_BY_ADDRESS[`${initialContractData.address.toLowerCase()}:${chainId}`];

  const { readTabLabel, singleReadMethodUid } = useMemo(() => {
    const selectedUids = router.query.methods ? (router.query.methods as string).split(",") : null;
    const allReadMethods = readMethodsWithInputsAndWriteMethods.filter(
      m => m.stateMutability === "view" || m.stateMutability === "pure",
    );
    const displayed = selectedUids ? allReadMethods.filter(m => selectedUids.includes(m.uid)) : allReadMethods;
    if (displayed.length === 1) return { readTabLabel: displayed[0].name, singleReadMethodUid: displayed[0].uid };
    return { readTabLabel: "Query", singleReadMethodUid: null };
  }, [router.query.methods, readMethodsWithInputsAndWriteMethods]);

  const { executeTabLabel, singleExecuteMethodUid } = useMemo(() => {
    const selectedUids = router.query.methods ? (router.query.methods as string).split(",") : null;
    const allWriteMethods = readMethodsWithInputsAndWriteMethods.filter(
      m => m.stateMutability !== "view" && m.stateMutability !== "pure",
    );
    const displayed = selectedUids ? allWriteMethods.filter(m => selectedUids.includes(m.uid)) : allWriteMethods;
    if (displayed.length === 1) return { executeTabLabel: displayed[0].name, singleExecuteMethodUid: displayed[0].uid };
    return { executeTabLabel: "Execute", singleExecuteMethodUid: null };
  }, [router.query.methods, readMethodsWithInputsAndWriteMethods]);

  return (
    <div className="drawer sm:drawer-open h-full">
      <input id="sidebar" type="checkbox" className="drawer-toggle" />
      <div className="drawer-side h-full z-50 sm:z-10">
        <label htmlFor="sidebar" aria-label="close sidebar" className="drawer-overlay"></label>
        <ul className="menu p-6 pr-6 pb-3 bg-base-200 h-full justify-between flex-nowrap">
          <MethodSelector
            readMethodsWithInputsAndWriteMethods={readMethodsWithInputsAndWriteMethods}
            abi={abi}
            onMethodSelect={handleMethodSelect}
            removeMethod={removeMethod}
          />
          <MiniFooter />
        </ul>
      </div>
      <div className="drawer-content flex flex-col items-center justify-center overflow-auto">
        <div className={`grid grid-cols-1 lg:grid-cols-6 w-full my-0 ${className} h-full flex-grow`}>
          <div className="col-span-6 flex flex-col gap-4 px-6 pb-10 pt-2">
            {/* Contract Overview — full width */}
            <div className="bg-base-200 shadow-xl rounded-2xl px-6 py-4 flex flex-wrap items-center gap-x-6 gap-y-1">
              <span className="font-bold">Contract Overview</span>
              {presetLabel && <span className="text-sm font-semibold text-primary">{presetLabel}</span>}
              <div className="flex items-center gap-2">
                <span className="font-medium text-base">Address</span>
                <span className="text-primary">
                  <Address address={initialContractData.address} />
                </span>
              </div>
              {implementationAddress && (
                <div className="flex items-center gap-1">
                  <span className="font-medium text-base text-green-600">Implementation</span>
                  <Address address={implementationAddress} />
                </div>
              )}
              {!isBalanceLoading && contractBalance !== null && contractBalance !== 0 && (
                <div className="flex items-center gap-1">
                  <span className="text-sm font-bold">Balance:</span>
                  <Balance address={initialContractData.address} className="h-1.5 min-h-[0.375rem] px-0" />
                </div>
              )}
              {mainNetwork && (
                <span className="flex items-center gap-2">
                  <span className="font-medium text-base">Blockchain</span>
                  <span className="text-primary">{mainNetwork.id == 31337 ? "Localhost" : mainNetwork.name}</span>
                </span>
              )}
              {!isContractCreationLoading && contractCreationInfo && (
                <div className="text-sm flex items-center gap-2">
                  <span className="font-bold">Created at:</span>
                  <span>Block {contractCreationInfo.blockNumber}</span>
                  <a
                    href={getBlockExplorerTxLink(chainId, contractCreationInfo.txHash)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link no-underline"
                  >
                    <ArrowTopRightOnSquareIcon className="w-4 h-4" />
                  </a>
                </div>
              )}
            </div>

            {/* Methods + Contract Data */}
            <div className="grid grid-cols-1 gap-6 laptop:grid-cols-[repeat(13,_minmax(0,_1fr))]">
              <div className="laptop:col-span-9 flex flex-col gap-6">
                <div className="z-10">
                  <div className="bg-base-200 rounded-2xl shadow-xl flex flex-col mt-10 relative">
                    <div className="h-[5rem] min-w-[5.5rem] bg-secondary absolute self-start rounded-[22px] -top-[38px] -left-[0px] -z-10 py-[0.65rem] px-3 shadow-lg shadow-base-300">
                      <div className="flex items-center gap-2">
                        <p className="my-0 text-sm font-bold whitespace-nowrap">{readTabLabel}</p>
                        {singleReadMethodUid && (
                          <button
                            onClick={() => removeMethod(singleReadMethodUid)}
                            className="btn btn-ghost btn-xs p-0 h-auto min-h-0 opacity-70 hover:opacity-100"
                          >
                            <XMarkIcon className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>
                    <div className="divide-y divide-base-300 px-5">
                      <ContractReadMethods
                        deployedContractData={{ address: initialContractData.address, abi }}
                        removeMethod={removeMethod}
                        initialParamsByMethod={initialParamsByMethod}
                      />
                    </div>
                  </div>
                </div>
                <div className="z-10">
                  <div className="bg-base-200 rounded-2xl shadow-xl flex flex-col mt-10 relative">
                    <div className="h-[5rem] min-w-[5.5rem] bg-secondary absolute self-start rounded-[22px] -top-[38px] -left-[0px] -z-10 py-[0.65rem] px-3 shadow-lg shadow-base-300">
                      <div className="flex items-center gap-2">
                        <p className="my-0 text-sm font-bold whitespace-nowrap">{executeTabLabel}</p>
                        {singleExecuteMethodUid && (
                          <button
                            onClick={() => removeMethod(singleExecuteMethodUid)}
                            className="btn btn-ghost btn-xs p-0 h-auto min-h-0 opacity-70 hover:opacity-100"
                          >
                            <XMarkIcon className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>
                    <div className="divide-y divide-base-300 px-5">
                      <ContractWriteMethods
                        deployedContractData={{ address: initialContractData.address, abi }}
                        onChange={triggerRefreshDisplayVariables}
                        removeMethod={removeMethod}
                        initialParamsByMethod={initialParamsByMethod}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="laptop:col-span-4 flex flex-col mt-10">
                <div className="bg-base-200 shadow-xl rounded-2xl px-6 py-4">
                  <span className="block font-bold pb-3">Contract Data</span>
                  <ContractVariables
                    refreshDisplayVariables={refreshDisplayVariables}
                    deployedContractData={initialContractData}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
