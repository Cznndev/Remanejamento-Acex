import { getMainDefinition } from "@apollo/client/utilities"
import { createClient } from "graphql-ws"

// URLs para os endpoints GraphQL
const httpUrl = process.env.NEXT_PUBLIC_GRAPHQL_HTTP_URL || "http://localhost:4000/graphql"

// WebSocket link para subscriptions
const wsUrl =
  typeof window !== "undefined"
    ? process.env.NEXT_PUBLIC_GRAPHQL_WS_URL || "ws://localhost:4000/graphql"
    : null

// GraphQL client based on fetch
interface GraphQLResponse<T> {
  data?: T
  errors?: Array<{ message: string }>
}

export const graphqlClient = {
  async query<T>(query: string, variables?: Record<string, unknown>): Promise<GraphQLResponse<T>> {
    try {
      const response = await fetch(httpUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${typeof window !== "undefined" ? localStorage.getItem("authToken") || "" : ""}`,
        },
        body: JSON.stringify({
          query,
          variables,
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error("[v0] GraphQL query error:", error)
      return {
        errors: [{ message: error instanceof Error ? error.message : "Unknown error" }],
      }
    }
  },

  async mutate<T>(mutation: string, variables?: Record<string, unknown>): Promise<GraphQLResponse<T>> {
    return this.query<T>(mutation, variables)
  },
}

// Hooks personalizados para consultas comuns
