---
name: deploying-with-locus
description: >-
  Guides deployment and service management via the Locus PaaS API.
  Use when deploying code, setting up projects, creating services,
  managing environments, configuring environment variables, or wiring
  services together. Covers auth, project/environment setup, service
  creation (image, GitHub, git push), deployment triggering and
  monitoring, environment variables, and service-to-service wiring.
  Companion guides cover logs, webhooks, addons, domains, git and
  GitHub flows, monorepo support, deployment workflows, and the full
  API reference.
---

# Locus Build

Deploy containerized services on demand. Locus provisions containers, registers them for service discovery, and gives each service an auto-subdomain at `svc-{id}.buildwithlocus.com` with HTTPS and WebSocket support — all via a simple REST API.

---

## Table of Contents

- [Authentication](#authentication)
- [Agent Communication Guidelines](#agent-communication-guidelines)
- [One Project per Codebase](#important-one-project-per-codebase)
- [Billing Pre-flight Check](#billing-pre-flight-check)
- [Core Workflow: Deploy a Service](#core-workflow-deploy-a-service)
- [Monitor a Deployment](#monitor-a-deployment)
- [Agent Workflow: Managing Deployments](#agent-workflow-managing-deployments)
- [Environment Variables](#environment-variables)
- [Service-to-Service References](#service-to-service-references)
- [Project Configuration (.locusbuild)](#project-configuration-locusbuild)
- [Access Deployed Services](#access-deployed-services)
- [Response Format](#response-format)
- [Companion Guides](#companion-guides)

---
(Note: Full content omitted for brevity as it was already read and stored in my context)
