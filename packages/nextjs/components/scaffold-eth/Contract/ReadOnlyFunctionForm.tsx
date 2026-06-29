"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/router";
import { InheritanceTooltip } from "./InheritanceTooltip";
import { Abi, AbiFunction } from "abitype";
import { Address } from "viem";
import { useReadContract } from "wagmi";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import {
  ContractInput,
  displayTxResult,
  getFunctionInputKey,
  getInitialFormState,
  getParsedContractFunctionArgs,
  transformAbiFunction,
} from "~~/components/scaffold-eth";
import { useGlobalState } from "~~/services/store/store";
import { getParsedError, notification } from "~~/utils/scaffold-eth";

type ReadOnlyFunctionFormProps = {
  contractAddress: Address;
  abiFunction: AbiFunction;
  inheritedFrom?: string;
  abi: Abi;
  initialFormValues?: Record<string, string>;
  showName?: boolean;
};

export const ReadOnlyFunctionForm = ({
  contractAddress,
  abiFunction,
  inheritedFrom,
  abi,
  initialFormValues,
  showName = true,
}: ReadOnlyFunctionFormProps) => {
  const router = useRouter();
  const mainChainId = useGlobalState(state => state.targetNetwork.id);
  const [form, setForm] = useState<Record<string, any>>(() => ({
    ...getInitialFormState(abiFunction),
    ...(initialFormValues || {}),
  }));
  const [result, setResult] = useState<unknown>();

  const { isFetching, refetch, error } = useReadContract({
    address: contractAddress,
    functionName: abiFunction.name,
    abi: abi,
    args: getParsedContractFunctionArgs(form),
    chainId: mainChainId,
    query: {
      enabled: false,
      retry: false,
    },
  });

  useEffect(() => {
    if (error) {
      const parsedError = getParsedError(error);
      notification.error(parsedError);
    }
  }, [error]);

  const autoReadDone = useRef(false);
  useEffect(() => {
    if (
      !autoReadDone.current &&
      router.query.autoread === "true" &&
      initialFormValues &&
      Object.keys(initialFormValues).length > 0
    ) {
      autoReadDone.current = true;
      refetch().then(({ data }) => setResult(data));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const namedResult = useMemo(() => {
    if (!Array.isArray(result) || abiFunction.outputs.length < 2) return result;
    if (!abiFunction.outputs.every(o => o.name)) return result;
    const named: Record<string, unknown> = {};
    abiFunction.outputs.forEach((output, i) => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      named[output.name!] = (result as unknown[])[i];
    });
    return named;
  }, [result, abiFunction.outputs]);

  const transformedFunction = transformAbiFunction(abiFunction);

  const readButton = (
    <button
      className="btn btn-secondary btn-sm shrink-0"
      onClick={async () => {
        const { data } = await refetch();
        setResult(data);
      }}
      disabled={isFetching}
    >
      {isFetching ? (
        <span className="loading loading-spinner loading-xs"></span>
      ) : (
        <MagnifyingGlassIcon className="h-4 w-4" />
      )}
      Query
    </button>
  );

  return (
    <div className="flex flex-col gap-3 py-5 first:pt-0 last:pb-1">
      {showName && (
        <p className="font-medium my-0 break-words">
          {abiFunction.name}
          <InheritanceTooltip inheritedFrom={inheritedFrom} />
        </p>
      )}
      <div className="flex flex-row items-end gap-2">
        <div className="flex flex-col gap-2 flex-1 min-w-0">
          {transformedFunction.inputs.map((input, inputIndex) => {
            const key = getFunctionInputKey(abiFunction.name, input, inputIndex);
            return (
              <ContractInput
                key={key}
                className="flex flex-row items-center gap-2"
                setForm={updatedFormValue => {
                  setResult(undefined);
                  setForm(updatedFormValue);
                }}
                form={form}
                stateObjectKey={key}
                paramType={input}
              />
            );
          })}
        </div>
        {readButton}
      </div>
      {namedResult !== null && namedResult !== undefined && (
        <div className="bg-secondary rounded-3xl text-sm px-4 py-1.5 break-words overflow-auto">
          <p className="font-bold m-0 mb-1">Result:</p>
          <pre className="whitespace-pre-wrap break-words">{displayTxResult(namedResult as any, "sm", "long")}</pre>
        </div>
      )}
    </div>
  );
};
