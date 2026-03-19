"use client";

import { AOPEditor } from "@/components/builder/aop-editor";
import { AgentConfigPanel } from "@/components/builder/agent-config-panel";
import { DeployBar } from "@/components/builder/deploy-bar";

export default function BuilderPage() {
  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)] -m-6">
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-[3] overflow-auto p-6 border-r">
          <AOPEditor />
        </div>
        <div className="flex-[2] overflow-auto p-6">
          <AgentConfigPanel />
        </div>
      </div>
      <DeployBar />
    </div>
  );
}
