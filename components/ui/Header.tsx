import { Sparkles } from "lucide-react";

export default function Header() {
  return (
    <header className="mb-8 text-center  pt-20">
      <h1 className="text-4xl font-bold mb-2">
        <span
          className={`italic flex flex-row text-purple-700
             px-1 antialiased justify-center`}
        >
          AI <Sparkles className=" ml-2 h-4 w-4 text-purple-700" />
        </span>
      </h1>
      <p className="text-muted-foreground">Powered Instagram Caption Engine</p>
    </header>
  );
}
