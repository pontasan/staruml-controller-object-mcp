import { createServer, objectTools } from "staruml-controller-mcp-core"

export function createObjectServer() {
    return createServer("staruml-controller-object", "1.0.0", objectTools)
}
