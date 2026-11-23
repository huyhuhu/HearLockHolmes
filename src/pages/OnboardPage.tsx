import { useSearchParams } from "react-router-dom";
import { OnboardWizard } from "../features/game/OnboardWizard";

export function OnboardPage() {
  const [params] = useSearchParams();
  const redirectTo = params.get("back") ?? undefined;
  return <OnboardWizard redirectTo={redirectTo} />;
}
