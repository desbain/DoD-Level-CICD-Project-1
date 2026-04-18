# DoD Tactical Operations Center Dashboard

A full-stack Military Operations Dashboard built with React and Express.js, featuring a production-grade CI/CD pipeline that mirrors the **DoD Enterprise DevSecOps Reference Design** with 13 security scanning stages.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Local Development](#local-development)
- [CI/CD Pipeline](#cicd-pipeline)
- [Pipeline Stages Explained](#pipeline-stages-explained)
- [GitHub Secrets Setup](#github-secrets-setup)
- [Docker Hub Setup](#docker-hub-setup)
- [SonarCloud Setup](#sonarcloud-setup)
- [Manual Deployment](#manual-deployment)
- [Running Scans Locally](#running-scans-locally)
- [Troubleshooting](#troubleshooting)

---

## Project Overview

The Tactical Operations Center (TOC) dashboard displays:
- **Mission Tracker** - Active operations with status, priority, and progress
- **Personnel Status** - Force readiness visualized with doughnut charts
- **Equipment Readiness** - Category-by-category bar chart
- **Threat Alerts** - Real-time alert feed with severity levels
- **KPI Status Cards** - Top-level metrics at a glance

The CI/CD pipeline implements every scanning stage mandated by the DoD DevSecOps Reference Design.

---

## Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend | React 18, Chart.js | Dashboard UI with charts |
| Backend | Express.js, Node 20 | REST API serving mock data |
| Security | Helmet, CORS, Rate Limiting | HTTP hardening |
| Container | Docker (multi-stage), Alpine | Minimal attack surface |
| CI/CD | GitHub Actions | 13-stage DevSecOps pipeline |
| SAST | SonarCloud | Static code analysis |
| SCA | npm audit, OSV-Scanner | Dependency vulnerabilities |
| Container Scan | Trivy | Image CVE scanning |
| IaC Scan | Checkov | Dockerfile/Compose misconfigs |
| DAST | OWASP ZAP | Runtime vulnerability testing |
| Secrets | Gitleaks | Hardcoded secret detection |
| SBOM | Syft | Software Bill of Materials |
| Compliance | Docker Bench | CIS benchmark validation |
| Registry | Docker Hub | Container image publishing |
| Hosting | AWS EC2 (us-east-2) | Production deployment |

---

## Project Structure

```
DoD-Level-CICD-Project/
├── .github/workflows/
│   └── dod-pipeline.yml            # 13-stage DoD DevSecOps pipeline
├── client/
│   ├── public/index.html           # React HTML template
│   └── src/
│       ├── components/
│       │   ├── Header.jsx/css      # Classification banner + clock
│       │   ├── StatusCards.jsx/css  # KPI metric cards
│       │   ├── MissionTracker.jsx/css
│       │   ├── PersonnelStatus.jsx/css  # Doughnut chart
│       │   ├── EquipmentReadiness.jsx/css # Bar chart
│       │   └── ThreatAlerts.jsx/css     # Alert feed
│       ├── App.jsx/css             # Dashboard layout + dark theme
│       └── index.js                # Entry point
├── server/
│   ├── routes/                     # API endpoints
│   ├── data/mockData.js            # Mock military ops data
│   ├── middleware/security.js      # Helmet, CORS, rate limiting
│   ├── app.js                      # Express app
│   ├── server.js                   # Server entry
│   └── __tests__/api.test.js       # Jest + Supertest tests
├── Dockerfile                      # Multi-stage build
├── docker-compose.yml              # Local dev (with security opts)
├── .eslintrc.json                  # ESLint + security plugin
├── jest.config.js                  # Test configuration
├── sonar-project.properties        # SonarCloud config
├── .gitleaksignore                 # Gitleaks false-positive list
├── .gitignore
├── .dockerignore
└── README.md
```

---

## Local Development

### Prerequisites

- Node.js 20+
- Docker & Docker Compose
- Git

### Quick Start (Docker)

```bash
# Clone and build
git clone https://github.com/<your-username>/DoD-Level-CICD-Project.git
cd DoD-Level-CICD-Project
docker-compose up --build

# Access at http://localhost:5000
```

### Development Mode (without Docker)

```bash
# Terminal 1 - Start backend
cd server
npm install
npm start
# API running at http://localhost:5000

# Terminal 2 - Start frontend
cd client
npm install
npm start
# React dev server at http://localhost:3000 (proxies API to :5000)
```

### Run Tests

```bash
cd server && npm test
```

### Run Lint

```bash
cd server && npm run lint
```

---

## CI/CD Pipeline

The pipeline at `.github/workflows/dod-pipeline.yml` implements 13 stages following the DoD DevSecOps Reference Design.

### Pipeline Architecture

```
Push to main / Pull Request
         │
    ┌────┴────────────────────────┐
    │                             │
    ▼                             ▼
┌─────────┐                 ┌──────────┐
│ 1. Lint │                 │ 5. Secrets│
│ (ESLint)│                 │ (Gitleaks)│
└────┬────┘                 └──────────┘
     ▼                             │
┌──────────┐    ┌──────────┐       │
│ 2. Tests │    │ 4. SCA   │       │
│  (Jest)  │    │(npm+OSV) │       │
└────┬─────┘    └────┬─────┘       │
     ▼               │             │
┌──────────┐         │             │
│ 3. SAST  │         │             │
│(Sonar)   │         │             │
└────┬─────┘         │             │
     └───────┬───────┘─────────────┘
             ▼
     ┌───────────────┐    ┌────────────┐
     │ 6. Build &    │    │ 8. IaC     │
     │    Push       │    │ (Checkov)  │
     │ (Docker Hub)  │    └────────────┘
     └───────┬───────┘
     ┌───────┼───────────────────┐
     ▼       ▼        ▼         ▼
┌────────┐┌───────┐┌───────┐┌──────────┐
│7. Trivy││9. SBOM││10.DAST││11.Comply │
│Container││(Syft) ││ (ZAP) ││(Bench)   │
└────┬───┘└───┬───┘└───┬───┘└────┬─────┘
     └────────┼────────┘─────────┘
              ▼
     ┌────────────────┐
     │ 12. Publish    │
     │   Artifacts    │
     └───────┬────────┘
             ▼
     ┌────────────────┐
     │ 13. Deploy     │
     │   to EC2       │
     └────────────────┘
```

### Triggers

| Event | Stages 1-5 (Analysis) | Stage 6 (Build) | Stages 7-13 (Scan & Deploy) |
|-------|:---------------------:|:----------------:|:---------------------------:|
| Push to `main` | Yes | Yes | Yes |
| Pull Request | Yes | No | No |

---

## Pipeline Stages Explained

### Stage 1: Lint (ESLint + Security Plugin)
Runs ESLint with `eslint-plugin-security` to catch common security anti-patterns like `eval()`, unsafe regex, buffer overflows, and timing attacks.

### Stage 2: Unit Tests (Jest + Coverage)
Runs Jest test suite with Supertest for API endpoint testing. Generates coverage reports in LCOV format for SonarCloud consumption.

### Stage 3: SAST - Static Application Security Testing (SonarCloud)
Deep static analysis of source code for bugs, code smells, and security vulnerabilities. Detects OWASP Top 10 issues like injection, XSS, and insecure deserialization.

### Stage 4: SCA - Software Composition Analysis (npm audit + OSV-Scanner)
Scans all npm dependencies (server + client) for known CVEs. OSV-Scanner cross-references against the Google OSV vulnerability database for broader coverage.

### Stage 5: Secrets Detection (Gitleaks)
Scans the entire git history for accidentally committed secrets: API keys, tokens, passwords, private keys, and other credentials.

### Stage 6: Build & Push (Docker Hub)
Builds the multi-stage Docker image and pushes to Docker Hub with `latest` and commit SHA tags. Only runs on push to `main`.

### Stage 7: Container Scan (Trivy)
Scans the built Docker image for HIGH and CRITICAL CVEs in OS packages and application dependencies. Fails the pipeline on actionable vulnerabilities.

### Stage 8: IaC Scan (Checkov)
Analyzes `Dockerfile` and `docker-compose.yml` for security misconfigurations against CIS Docker benchmarks. Checks for issues like running as root, missing healthchecks, and privileged containers.

### Stage 9: SBOM Generation (Syft)
Generates a Software Bill of Materials in CycloneDX JSON format. Required by Executive Order 14028 for software supply chain transparency.

### Stage 10: DAST - Dynamic Application Security Testing (OWASP ZAP)
Starts the application in a container, then runs OWASP ZAP baseline scan against it. Tests for runtime vulnerabilities like XSS, CSRF, missing security headers, and information disclosure.

### Stage 11: Compliance (Docker Bench for Security)
Runs Docker Bench for Security against the running container to validate CIS Docker benchmark compliance. Checks container runtime configuration, image hardening, and security options.

### Stage 12: Publish Scan Artifacts
Aggregates all scan results from stages 1-11 into downloadable GitHub Actions artifacts. Retained for 30 days for audit purposes.

### Stage 13: Deploy to EC2
Pulls the published image from Docker Hub, deploys to EC2 with security options (`--read-only`, `--security-opt no-new-privileges`), and runs a health check verification.

---

## GitHub Secrets Setup

Navigate to your GitHub repo > **Settings** > **Secrets and variables** > **Actions** > **New repository secret**.

### Required Secrets

| Secret | Purpose | How to Get It |
|--------|---------|---------------|
| `DOCKERHUB_USERNAME` | Docker Hub login | Your Docker Hub username |
| `DOCKERHUB_TOKEN` | Docker Hub access token | Docker Hub > Account Settings > Security > New Access Token (Read & Write) |
| `SONAR_TOKEN` | SonarCloud authentication | SonarCloud > My Account > Security > Generate Token |

# Setup Environment secret for Manual approval to Deploy to the Cluster
Go to your repo → Settings → Environments → New environment → name it production → add Required reviewers (your GitHub username) → Save.      
  Once that's done, every pipeline run will pause at Stage 14 and send you an email/notification asking for approval before anything touches the
   cluster.

---

## Docker Hub Setup

1. Create an account at [hub.docker.com](https://hub.docker.com/)
2. Go to **Account Settings** > **Security** > **New Access Token**
3. Name: `github-actions-dod-pipeline`
4. Permissions: **Read & Write**
5. Copy the token and add it as `DOCKERHUB_TOKEN` in GitHub Secrets

---

## SonarCloud Setup

1. Sign up at [sonarcloud.io](https://sonarcloud.io/) using your GitHub account
2. Import your repository
3. Note your **Organization Key** -- update it in `sonar-project.properties`
4. Go to **My Account** > **Security** > **Generate Token**
5. Add the token as `SONAR_TOKEN` in GitHub Secrets

---

## Manual Deployment

```bash
# Build and run locally
docker-compose up --build -d

# Or deploy to EC2 manually
docker build -t dod-ops-dashboard .
docker save dod-ops-dashboard | ssh -i key.pem ubuntu@<IP> "docker load"
ssh -i key.pem ubuntu@<IP> "docker run -d --name dod-ops-dashboard \
  --restart unless-stopped -p 80:5000 \
  --read-only --tmpfs /tmp \
  --security-opt no-new-privileges:true \
  dod-ops-dashboard"
```

---

## Running Scans Locally

You can run each scanning tool locally before pushing:

```bash
# ESLint with security rules
cd server && npx eslint . --ext .js

# Jest tests with coverage
npx jest --coverage --forceExit

# Trivy container scan
docker build -t dod-ops-dashboard .
trivy image --severity HIGH,CRITICAL --ignore-unfixed dod-ops-dashboard

# Trivy IaC scan
trivy config .

# Checkov IaC scan
checkov -f Dockerfile
checkov -f docker-compose.yml

# Gitleaks secrets scan
gitleaks detect --source .

# Syft SBOM generation
syft dod-ops-dashboard -o cyclonedx-json > sbom.json

# OWASP ZAP (requires running app)
docker run -d -p 5000:5000 dod-ops-dashboard
docker run --rm --net host zaproxy/zap-stable zap-baseline.py -t http://localhost:5000

# npm audit
cd server && npm audit
cd client && npm audit
```

---

## Troubleshooting

### Pipeline fails on Trivy container scan
Update the Node.js Alpine base image in `Dockerfile` or add `RUN apk update && apk upgrade --no-cache` to patch known CVEs.

### SonarCloud scan shows "not authorized"
Verify `SONAR_TOKEN` is set correctly and the `sonar.organization` in `sonar-project.properties` matches your SonarCloud org key.

### OWASP ZAP reports many findings
ZAP baseline scans flag informational items. Review the HTML report artifact and address HIGH/MEDIUM findings first. Low/Informational items are often acceptable for internal tools.

### Docker Bench warns about root user
The Dockerfile uses `USER appuser` for the production stage. If Docker Bench still flags it, verify the `USER` directive is present after all `COPY` commands.

### npm audit shows vulnerabilities in dev dependencies
Dev dependencies (`devDependencies`) are not included in the production Docker image. Use `npm audit --production` to see only production-relevant issues.

### Checkov fails on docker-compose.yml
Ensure `read_only: true`, `security_opt: [no-new-privileges:true]`, and `tmpfs` are configured. These are CIS Docker benchmark requirements.

==========================================================================================
# SET UP IAM ROLE FOR GITHUB TO AUTHENTICATE WITH YOUR CLUSTER
==========================================================================================
==========================================================================================
# SET UP IAM ROLE FOR GITHUB TO AUTHENTICATE WITH YOUR CLUSTER
==========================================================================================
==========================================================================================
# SET UP IAM ROLE FOR GITHUB TO AUTHENTICATE WITH YOUR CLUSTER
==========================================================================================
 You need to create two things: the GitHub OIDC provider (so AWS trusts GitHub's tokens) and the IAM role itself. Here are the exact AWS CLI   
  commands:

# Step 1 — Create the GitHub OIDC provider (one-time per AWS account)
aws iam create-open-id-connect-provider --url https://token.actions.githubusercontent.com --client-id-list sts.amazonaws.com --thumbprint-list 6938fd4d98bab03faadb97b34396831e3780aea1

  Check if it already exists first:
  aws iam list-open-id-connect-providers
  If you see token.actions.githubusercontent.com in the output, skip Step 1.

  ---
# Step 2 — Create the trust policy document
  cat > trust-policy.json << 'EOF'
  {
    "Version": "2012-10-17",
    "Statement": [
      {
        "Effect": "Allow",
        "Principal": {
          "Federated": "arn:aws:iam::450665609241:oidc-provider/token.actions.githubusercontent.com"
        },
        "Action": "sts:AssumeRoleWithWebIdentity",
        "Condition": {
          "StringEquals": {
            "token.actions.githubusercontent.com:aud": "sts.amazonaws.com"
          },
          "StringLike": {
            "token.actions.githubusercontent.com:sub": "repo:Ernest41k/DoD-Level-CICD-Project:ref:refs/heads/main"
          }
        }
      }
    ]
  }
  EOF

  ---
# Step 3 — Create the IAM role
aws iam create-role \
  --role-name dod-ops-cluster-github-actions \
  --assume-role-policy-document file://trust-policy.json \
  --description "Assumed by GitHub Actions to deploy to EKS via ArgoCD"

  ---
Step 4 — Attach the EKS permissions policy
cat > eks-policy.json << 'EOF'
  {
    "Version": "2012-10-17",
    "Statement": [
      {
        "Effect": "Allow",
        "Action": [
          "eks:DescribeCluster",
          "eks:ListClusters"
        ],
        "Resource": "*"
      }
    ]
  }
  EOF

# This creates an inline policy attached directly to the role:
aws iam put-role-policy \
  --role-name dod-ops-cluster-github-actions \
  --policy-name eks-access \
  --policy-document file:///tmp/eks-policy.json

  ---
# Step 5 — Get the ARN for the GitHub secret
aws iam get-role --role-name dod-ops-cluster-github-actions \
--query 'Role.Arn' --output text

  Copy that ARN and set it in GitHub → Settings → Secrets and variables → Actions → AWS_ROLE_ARN.

  ---
  Step 6 — Grant the role access to your EKS cluster
  aws eks create-access-entry \
    --cluster-name <your-cluster-name> \
    --region us-east-2 \
    --principal-arn arn:aws:iam::450665609241:role/dod-ops-cluster-github-actions \
    --type STANDARD

  aws eks associate-access-policy \
    --cluster-name <your-cluster-name> \
    --region us-east-2 \
    --principal-arn arn:aws:iam::450665609241:role/dod-ops-cluster-github-actions \
    --policy-arn arn:aws:eks::aws:cluster-access-policy/AmazonEKSClusterAdminPolicy \
    --access-scope type=cluster

# Register the IAM Role to the Cluster
aws eks create-access-entry \
    --cluster-name dod-ops-cluster \
    --region us-east-2 \
    --principal-arn arn:aws:iam::450665609241:role/dod-ops-cluster-github-actions \
    --type STANDARD

aws eks associate-access-policy \
    --cluster-name dod-ops-cluster \
    --region us-east-2 \
    --principal-arn arn:aws:iam::450665609241:role/dod-ops-cluster-github-actions \
    --policy-arn arn:aws:eks::aws:cluster-access-policy/AmazonEKSClusterAdminPolicy \
    --access-scope type=cluster

# For nginx ingress Controller to work, you need to add the following tags to both subnets:
  Go to VPC → Subnets in the AWS console, select each public subnet, and add these tags:

# force the AWS LBC to use instance mode (NodePorts) instead of IP mode. Instance mode is more reliable with ingress-nginx and    
#  uses the correct NodePorts (30408/30575).
helm upgrade ingress-nginx ingress-nginx/ingress-nginx \
    --namespace ingress-nginx \
    --reuse-values \
    --set controller.service.annotations."service\.beta\.kubernetes\.io/aws-load-balancer-scheme"=internet-facing \
    --set controller.service.annotations."service\.beta\.kubernetes\.io/aws-load-balancer-target-type"=instance

  ┌───────────────────────────────────────────┬────────┐
  │                    Key                    │ Value  │
  ├───────────────────────────────────────────┼────────┤
  │ kubernetes.io/cluster/<your-cluster-name> │ shared │
  ├───────────────────────────────────────────┼────────┤
  │ kubernetes.io/role/elb                    │ 1      │
  └───────────────────────────────────────────┴────────┘

  EC2 → Security Groups → Set the node group security group → Inbound rules
  It needs:
  ┌────────────┬─────────────┬───────────┐
  │    Type    │    Port     │  Source   │
  ├────────────┼─────────────┼───────────┤
  │ HTTP       │ 80          │ 0.0.0.0/0 │
  ├────────────┼─────────────┼───────────┤
  │ HTTPS      │ 443         │ 0.0.0.0/0 │
  ├────────────┼─────────────┼───────────┤
  │ Custom TCP │ 30000-32767 │ 0.0.0.0/0 │
  └────────────┴─────────────┴───────────┘

=========================================================================
# Interview Prep Scenarios
=========================================================================
 1. Container Scan Failing Due to Bundled npm Vulnerabilities (CVE)                                                                                                                                                                                                                              During the Trivy container scan stage, the pipeline was failing with HIGH severity CVEs for minimatch even though our application didn't        directly use the vulnerable version. After investigation, I discovered the root cause was that npm install -g npm@latest in the production
  stage of the Dockerfile installs npm, which bundles its own internal copy of minimatch at                                                     
  /usr/local/lib/node_modules/npm/node_modules/minimatch. Trivy was scanning that bundled copy. I resolved this by restructuring the Dockerfile
  into a 3-stage build — Stage 1 builds the React frontend, Stage 2 installs production server dependencies, and Stage 3 is the final production
   image which copies only the pre-built artifacts and explicitly removes npm entirely since the app only needs Node at runtime.

  ---
  2. Terraform Destroy Failing Due to Orphaned Load Balancer

  When I tried to destroy the EKS cluster using terraform destroy, it failed with a DependencyViolation error because the subnets and internet  
  gateway couldn't be deleted. The cause was that ingress-nginx had provisioned an AWS NLB that Terraform didn't manage, and that NLB was       
  holding references to the VPC subnets. I resolved this by first deleting the ingress-nginx namespace to trigger Kubernetes to decommission the
   NLB, waiting for AWS to fully remove it, and then re-running terraform destroy successfully. I also documented this as a required pre-destroy
   step in the project's runbook.

  ---
  3. kubectl Authentication Failing After Cluster Rebuild

  After rebuilding the cluster, kubectl commands were failing with "the server has asked for the client to provide credentials" even after      
  running aws eks update-kubeconfig. The issue was that the cluster's authentication mode was set to API_AND_CONFIG_MAP but my IAM user
  (Mainuser) had not been added as an access entry. Unlike older EKS setups that automatically added the creator to aws-auth, the newer API auth
   mode requires explicitly creating an access entry. I resolved this by using aws eks create-access-entry and aws eks associate-access-policy  
  to grant my IAM user cluster-admin access.

  ---
  4. Security Gap: Docker Image Pushed Before Security Scans

  I identified a significant security gap in the pipeline where the Docker image was being pushed to Docker Hub at Stage 6, but the container   
  scan (Trivy), SBOM generation, DAST, and compliance checks didn't run until Stages 7–11. This meant a potentially vulnerable image was        
  publicly available before it had been vetted. I restructured the pipeline so Stage 6 only builds the image locally for validation, and added a
   new Stage 12 that pushes to Docker Hub only after all security scans pass. This ensures no unscanned image ever reaches the registry.        

  ---
  5. Large Terraform Provider Binaries Accidentally Committed to Git

  A git push was rejected by GitHub because Terraform provider binaries (up to 685MB) had been accidentally staged and committed — the
  terraform/.terraform/ directory was missing from .gitignore. Simply adding a new commit to remove them didn't work because GitHub scans all   
  commits in a push, not just the latest. I resolved this by doing a git reset --soft origin/main to collapse both commits back into staged     
  changes without losing file edits, unstaging the binary files, recommitting only the intended files, and then pushing cleanly.

  ---
  6. Helm Release Stuck in Pending-Install State

  On re-runs of the bootstrap pipeline after a failed install, Helm would fail with "another operation is in progress." A previous interrupted  
  run had left the ingress-nginx release in a pending-install state, and helm upgrade --install refuses to proceed in that case. I added a      
  cleanup step to the bootstrap pipeline that checks the current Helm release status and runs helm uninstall if the release is in a
  pending-install, pending-upgrade, or failed state before attempting the install.

  ---
  7. ingress-nginx Controller Pods Never Starting

  After fixing the stuck release issue, the Helm install was timing out because the ingress-nginx pods never became ready. I identified that I  
  was passing --set controller.image.tag=v1.14.3 to the Helm install, but the chart version 4.14.3 already pins the correct controller version  
  internally. Manually overriding just the tag portion was corrupting the full image reference the chart constructs internally, causing the pods
   to fail to pull the image. Removing that override and letting the chart manage its own image reference resolved the issue.

  ---
  8. NLB Not Provisioning (Internal vs Internet-Facing)

  After ingress-nginx was installed, the LoadBalancer service stayed in <pending> state for over 40 minutes. Running kubectl describe svc       
  revealed the error: "Failed build model due to unable to resolve at least one subnet (0 match VPC and tags: kubernetes.io/role/internal-elb)".
   I identified that the cluster had the AWS Load Balancer Controller installed, which defaults to creating internal load balancers. Since we
  needed a public-facing load balancer, I added the annotation service.beta.kubernetes.io/aws-load-balancer-scheme: internet-facing to the      
  ingress-nginx service. I also added the required subnet tags (kubernetes.io/role/elb: 1 and kubernetes.io/cluster/<name>: shared) to the      
  public subnets, which are not applied automatically when creating an EKS cluster manually.

  ---
  9. Kubernetes Health Probes Triggering Rate Limiter (HTTP 429)

  The application pods were repeatedly crashing and restarting. Checking the pod events showed Liveness probe failed: HTTP probe failed with    
  statuscode: 429. The Express server had a global rate limiter set to 100 requests per 15 minutes, and with 2 pods each running readiness      
  probes every 10 seconds, the probes alone were generating approximately 180 requests per 15 minutes — well exceeding the limit. The rate      
  limiter was throttling the probes, causing liveness failures, which triggered pod restarts in a continuous loop. I resolved this by moving the
   /api/health route registration to before the app.use(limiter) middleware in the Express app so probes bypass rate limiting entirely. I also  
  increased the readiness probe interval from 10 to 30 seconds as an additional safeguard.

  ---
  10. GitHub Actions IAM Role Missing EKS Access

  The bootstrap pipeline was failing because the GitHub Actions IAM role (dod-ops-cluster-github-actions) didn't have access to the EKS cluster.
   The role was created with only eks:DescribeCluster and eks:ListClusters permissions — sufficient for the deployment pipeline but not enough  
  to call kubectl. I resolved this by adding the role as an EKS access entry and associating it with AmazonEKSClusterAdminPolicy. I also learned
   that this is a one-time manual step per cluster and should not be automated in the pipeline itself, since the pipeline role would need       
  eks:CreateAccessEntry permissions to do it — which would be over-privileged for a deployment role.

==============================================================================================================
# CONNECT TO THE KUBERNETES CLUSTER # CONNECT TO THE KUBERNETES CLUSTER # CONNECT TO THE KUBERNETES CLUSTER
==============================================================================================================
==============================================================================================================
# CONNECT TO THE KUBERNETES CLUSTER # CONNECT TO THE KUBERNETES CLUSTER # CONNECT TO THE KUBERNETES CLUSTER
==============================================================================================================
==============================================================================================================
# CONNECT TO THE KUBERNETES CLUSTER # CONNECT TO THE KUBERNETES CLUSTER # CONNECT TO THE KUBERNETES CLUSTER
==============================================================================================================
 Cluster Access

  # Connect to your EKS cluster
  aws eks update-kubeconfig --region us-east-2 --name dod-ops-cluster

  ---
  Pods
  # To change the default namespace for your current Kubernetes context
  kubectl config set-context --current --namespace=<namespace-name>
  
  # List all pods in your app namespace
  kubectl get pods -n dod-production

  # Watch pods in real time
  kubectl get pods -n dod-production -w

  # Describe a pod (events, resource limits, probe status)
  kubectl describe pod <pod-name> -n dod-production

  # View live logs
  kubectl logs <pod-name> -n dod-production

  # Follow logs (tail -f equivalent)
  kubectl logs -f <pod-name> -n dod-production

  # Logs from previous crashed container (if pod restarted)
  kubectl logs <pod-name> -n dod-production --previous

  # Shell into a running pod
  kubectl exec -it <pod-name> -n dod-production -- //bin/sh

  ---
  Deployments

  # Check deployment status
  kubectl get deployment -n dod-production

  # See full deployment details (image, replicas, strategy)
  kubectl describe deployment dod-ops-dashboard-dod-ops-dashboard -n dod-production

  # Check rollout status
  kubectl rollout status deployment/dod-ops-dashboard-dod-ops-dashboard -n dod-production

  # View rollout history
  kubectl rollout history deployment/dod-ops-dashboard-dod-ops-dashboard -n dod-production

  # Roll back to the previous version
  kubectl rollout undo deployment/dod-ops-dashboard-dod-ops-dashboard -n dod-production

  # Scale replicas manually
  kubectl scale deployment dod-ops-dashboard-dod-ops-dashboard -n dod-production --replicas=3

  ---
  Services & Load Balancer

  # Get the NLB hostname
  kubectl get svc ingress-nginx-controller -n ingress-nginx

  # Get all services in your app namespace
  kubectl get svc -n dod-production

  # Test app health directly
  curl http://<NLB-hostname>/api/health

  ---
  Ingress

  # Check ingress rules
  kubectl get ingress -n dod-production

  # Describe ingress (backend, TLS, events)
  kubectl describe ingress -n dod-production

  ---
  HPA (Autoscaler)

  # Check if HPA is scaling
  kubectl get hpa -n dod-production

  # Watch HPA metrics live
  kubectl get hpa -n dod-production -w

  ---
  ArgoCD

  # Check ArgoCD app sync status
  kubectl get application -n argocd

  # Describe the app (sync errors, health)
  kubectl describe application dod-ops-dashboard -n argocd

  # Force a manual sync
  kubectl patch application dod-ops-dashboard -n argocd \
    --type merge -p '{"operation":{"initiatedBy":{"username":"admin"},"sync":{"revision":"HEAD"}}}'

  # Get ArgoCD admin password
  kubectl get secret argocd-initial-admin-secret -n argocd \
    -o jsonpath="{.data.password}" | base64 -d

  ---
  Events & Debugging

  # See all recent events in a namespace (great for spotting failures)
  kubectl get events -n dod-production --sort-by='.lastTimestamp'

  # Events across all namespaces
  kubectl get events -A --sort-by='.lastTimestamp'

  # Check node health
  kubectl get nodes

  # Check resource usage per node
  kubectl top nodes

  # Check resource usage per pod
  kubectl top pods -n dod-production

  ---
  Helm

  # List Helm releases
  helm list -A

  # Check a specific release status
  helm status dod-ops-dashboard -n dod-production

  # See computed values for the release
  helm get values dod-ops-dashboard -n dod-production

  # Manually roll back a Helm release
  helm rollback dod-ops-dashboard 1 -n dod-production

  ---
  Quick Troubleshooting Sequence

  When something is broken, run these in order:

  # 1. Are pods running?
  kubectl get pods -n dod-production

  # 2. Why is a pod failing?
  kubectl describe pod <pod-name> -n dod-production

  # 3. What is the app logging?
  kubectl logs <pod-name> -n dod-production --previous

  # 4. Did ArgoCD sync correctly?
  kubectl get application -n argocd

  # 5. Any cluster-wide events?
  kubectl get events -A --sort-by='.lastTimestamp' | tail -20