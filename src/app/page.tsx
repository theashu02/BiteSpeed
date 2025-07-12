import { Button } from "@/components/ui/button";
import Flow from "./components/Flow";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <Flow />
      <Button variant="outline" className="p-5 bg-amber-200">Hello button</Button>
    </div>
  );
}
