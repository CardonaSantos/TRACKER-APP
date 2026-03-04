import { AppCenter } from "@/components/reusable/AppCenter";
import { AppContainer } from "@/components/reusable/AppContainer";
import StartTracking from "@/components/tracking/start-tracking";
import React from "react";

export default function Dashboard() {
  return (
    <AppContainer padded>
      <AppCenter vertical={false}>
        <StartTracking />
      </AppCenter>
    </AppContainer>
  );
}
