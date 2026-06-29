import { ReactElement, useState } from "react";
import { TransactionBase, TransactionReceipt, formatEther, isAddress } from "viem";
import { CheckCircleIcon, DocumentDuplicateIcon } from "@heroicons/react/24/outline";
import { ArrowsRightLeftIcon } from "@heroicons/react/24/solid";
import { Address } from "~~/components/scaffold-eth";
import { replacer } from "~~/utils/scaffold-eth/common";

type DisplayContent =
  | string
  | number
  | bigint
  | Record<string, any>
  | TransactionBase
  | TransactionReceipt
  | undefined
  | unknown;

type ResultFontSize = "sm" | "base" | "xs" | "lg" | "xl" | "2xl" | "3xl";

const isUrl = (value: string) => value.startsWith("http://") || value.startsWith("https://");

// Strings longer than this with no spaces can't wrap — use CSS ellipsis.
const TRUNCATE_LEN = 40;
const isLongNoBreak = (s: string) => s.length > TRUNCATE_LEN && !s.includes(" ");

const CopyButton = ({ value }: { value: string }) => {
  const [copied, setCopied] = useState(false);
  return (
    <button
      className="inline-flex btn btn-ghost btn-xs p-0 h-auto min-h-0 opacity-50 hover:opacity-100"
      onClick={() => {
        navigator.clipboard.writeText(value);
        setCopied(true);
        setTimeout(() => setCopied(false), 800);
      }}
    >
      {copied ? <CheckCircleIcon className="h-3.5 w-3.5" /> : <DocumentDuplicateIcon className="h-3.5 w-3.5" />}
    </button>
  );
};

const renderStringValue = (value: string) => {
  const long = isLongNoBreak(value);

  if (long) {
    const textEl = isUrl(value) ? (
      <a
        href={value}
        target="_blank"
        rel="noopener noreferrer"
        className="underline text-blue-300 hover:text-blue-100 truncate"
        title={value}
      >
        {value}
      </a>
    ) : (
      <span className="truncate" title={value}>
        {value}
      </span>
    );

    return (
      <span className="inline-flex items-center gap-1 min-w-0 flex-1 overflow-hidden">
        {textEl}
        <span className="shrink-0">
          <CopyButton value={value} />
        </span>
      </span>
    );
  }

  const content = isUrl(value) ? (
    <a href={value} target="_blank" rel="noopener noreferrer" className="underline text-blue-300 hover:text-blue-100">
      {value}
    </a>
  ) : (
    <span>{value}</span>
  );

  return (
    <span className="inline-flex items-center gap-1">
      {content}
      <CopyButton value={value} />
    </span>
  );
};

export const displayTxResult = (
  displayContent: DisplayContent | DisplayContent[],
  fontSize: ResultFontSize = "base",
  addressFormat: "short" | "long" = "short",
): string | ReactElement | number => {
  if (displayContent == null) {
    return "";
  }

  if (typeof displayContent === "bigint") {
    return <NumberDisplay value={displayContent} />;
  }

  if (typeof displayContent === "string") {
    if (isAddress(displayContent)) {
      return <Address address={displayContent} format={addressFormat} size={fontSize} />;
    }

    const parsedJson = tryParseJsonObject(displayContent);
    if (parsedJson) {
      return <JsonDisplay value={parsedJson} />;
    }

    return renderStringValue(displayContent);
  }

  if (Array.isArray(displayContent)) {
    return <ArrayDisplay values={displayContent} size={fontSize} addressFormat={addressFormat} />;
  }

  if (typeof displayContent === "object") {
    return <StructDisplay struct={displayContent} size={fontSize} addressFormat={addressFormat} />;
  }

  return JSON.stringify(displayContent, replacer, 2);
};

const NumberDisplay = ({ value }: { value: bigint }) => {
  const [isEther, setIsEther] = useState(false);

  const asNumber = Number(value);
  if (asNumber <= Number.MAX_SAFE_INTEGER && asNumber >= Number.MIN_SAFE_INTEGER) {
    return <span>{String(value)}</span>;
  }

  return (
    <div className="flex items-baseline">
      {isEther ? "Ξ" + formatEther(value) : String(value)}
      <span
        className="tooltip tooltip-secondary font-sans ml-2"
        data-tip={isEther ? "Multiply by 1e18" : "Divide by 1e18"}
      >
        <button className="btn btn-ghost btn-circle btn-xs" onClick={() => setIsEther(!isEther)}>
          <ArrowsRightLeftIcon className="h-3 w-3 opacity-65" />
        </button>
      </span>
    </div>
  );
};

const tryParseJsonObject = (value: string): Record<string, unknown> | null => {
  const attempt = (s: string) => {
    try {
      const parsed = JSON.parse(s);
      if (typeof parsed === "object" && parsed !== null && !Array.isArray(parsed)) {
        return parsed as Record<string, unknown>;
      }
    } catch {}
    return null;
  };
  return attempt(value) ?? attempt(`{${value}}`);
};

const renderJsonWithLinks = (text: string): ReactElement => {
  const parts = text.split(/(https?:\/\/[^\s"\\]+)/g);
  return (
    <>
      {parts.map((part, i) =>
        isUrl(part) ? (
          <a
            key={i}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className="underline text-blue-300 hover:text-blue-100"
          >
            {part}
          </a>
        ) : (
          part
        ),
      )}
    </>
  );
};

const JsonDisplay = ({ value }: { value: Record<string, unknown> }) => {
  const formatted = JSON.stringify(value, null, 2);
  return (
    <span className="inline-flex items-start gap-1">
      <pre className="whitespace-pre-wrap break-words text-xs font-mono">{renderJsonWithLinks(formatted)}</pre>
      <span className="shrink-0 mt-0.5">
        <CopyButton value={formatted} />
      </span>
    </span>
  );
};

export const ObjectFieldDisplay = ({
  name,
  value,
  size,
  leftPad = true,
  addressFormat = "short",
}: {
  name: string;
  value: DisplayContent;
  size: ResultFontSize;
  leftPad?: boolean;
  addressFormat?: "short" | "long";
}) => {
  const jsonObject = typeof value === "string" ? tryParseJsonObject(value) : null;

  if (jsonObject) {
    return (
      <div className={`flex flex-col gap-y-0.5 ${leftPad ? "ml-4" : ""}`}>
        <span className="font-bold text-base-content dark:text-gray-400">{name}:</span>
        <div className="ml-2">
          <JsonDisplay value={jsonObject} />
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-row items-baseline min-w-0 ${leftPad ? "ml-4" : ""}`}>
      <span className="font-bold text-base-content dark:text-gray-400 mr-2 shrink-0">{name}:</span>
      <span className="text-base-content min-w-0 flex-1 overflow-hidden">
        {displayTxResult(value, size, addressFormat)}
      </span>
    </div>
  );
};

const ArrayDisplay = ({
  values,
  size,
  addressFormat = "short",
}: {
  values: DisplayContent[];
  size: ResultFontSize;
  addressFormat?: "short" | "long";
}) => {
  return (
    <div className="flex flex-col gap-y-1">
      {values.length ? "array" : "[]"}
      {values.map((v, i) => (
        <ObjectFieldDisplay key={i} name={`[${i}]`} value={v} size={size} addressFormat={addressFormat} />
      ))}
    </div>
  );
};

const StructDisplay = ({
  struct,
  size,
  addressFormat = "short",
}: {
  struct: Record<string, any>;
  size: ResultFontSize;
  addressFormat?: "short" | "long";
}) => {
  return (
    <div className="flex flex-col gap-y-1">
      {Object.entries(struct).map(([k, v]) => (
        <ObjectFieldDisplay key={k} name={k} value={v} size={size} addressFormat={addressFormat} />
      ))}
    </div>
  );
};
