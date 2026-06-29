import { HeartIcon } from "@heroicons/react/24/outline";
import { ThreeVidenZLogo } from "~~/components/assets/ThreeVidenZLogo";

export const MiniFooter = () => {
  return (
    <div className="flex justify-center items-center gap-1 text-xs w-full mt-10 z-10">
      <div className="flex justify-center items-center gap-2">
        <p className="m-0 text-center">
          Built with <HeartIcon className="inline-block h-4 w-4" /> by
        </p>
        <a
          className="flex justify-center items-center gap-1"
          href="https://www.3videnz.com"
          target="_blank"
          rel="noreferrer"
        >
          <ThreeVidenZLogo className="h-4 w-auto pb-0.5" />
          <span className="link">3videnZ</span>
        </a>
      </div>
    </div>
  );
};
