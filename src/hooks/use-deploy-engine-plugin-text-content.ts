import { useContext } from "react";
import { DeployEnginePluginTextContentContext } from "../contexts/deploy-engine";

function useDeployEnginePluginTextContent() {
    return useContext(DeployEnginePluginTextContentContext);
}

export default useDeployEnginePluginTextContent;
