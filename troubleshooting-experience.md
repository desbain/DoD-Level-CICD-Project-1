# Troubleshooting Experience Log (For Interviews)

## Scenario: Git Untracked File Ignored & Directory Misalignment

**Situation:** 
While configuring an IAM OpenID Connect (OIDC) provider for a new EKS deployment using GitHub Actions, I created a custom IAM trust policy (`trust-policy.json`). 

**Task:** 
I needed to commit this new policy file and push it to my remote repository so that my CI/CD pipeline could utilize it to authenticate with AWS. However, when attempting to run `git add .` and `git commit`, Git repeatedly returned "nothing to commit, working tree clean", completely bypassing the file I had just created.

**Action:** 
Instead of blindly forcing commands, I systematically debugged my environment geometry and Git configuration:
1. **Directory Validation (Path Discovery):** I noticed that my terminal was correctly in the repository root (`Dod-Level-CICD-Project-1`), but I had initially created the `trust-policy.json` file one level up in the parent directory (`DOD-LEVEL-CICD-PROJECT-1`). I corrected the file path by moving it into the tracked repository folder.
2. **Git Ignore Inspection:** Even after physically placing the file in the repository, Git still ignored it. I utilized Git commands (such as `git check-ignore`) and inspected the `.gitignore` configuration natively.
3. **Configuration Adjustment:** I found that my `.gitignore` file had explicit rules to ignore files matching `*-policy.json` (specifically `trust-policy.json` and `eks-policy.json`). I edited the `.gitignore` file to comment out these specific overrides since tracking the infrastructure authentication policy was fundamentally required for code reproducibility in this specific automation.

**Result:** 
By resolving both the directory topology oversight and the underlying git configuration conflict, I successfully added, committed, and pushed the crucial OIDC trust policy to `origin/main`. This unblocked the pipeline execution and ensured AWS and GitHub actions had securely authenticated role access, adhering to Infrastructure as Code best practices.

---

## Scenario: AWS IAM OIDC Authentication Failure (Not authorized to perform sts:AssumeRoleWithWebIdentity)

**Situation:**
After successfully configuring my GitHub Actions pipeline to authenticate via AWS OIDC (OpenID Connect), the workflow failed drastically with the error: `Not authorized to perform sts:AssumeRoleWithWebIdentity`. This halted my automated EKS deployments.

**Task:**
I needed to diagnose the authentication pipeline and remediate the secure handshake layer between my AWS IAM infrastructure and the GitHub Actions event token.

**Action:**
To pinpoint the origin of the failure, I validated both ends of the authentication mechanism instead of making random guesses:
1. **Verified Pipeline Configuration:** First, I inspected the workflow YAML to confirm the target ARN was pointing to the intended IAM role (`dod-ops-cluster-github-actions`) and that OIDC token permissions (`id-token: write`) were correctly declared. Everything was formatted properly on the GitHub side.
2. **Audited Infrastructure State (Cloud vs Local):** While I knew the local JSON trust policy file successfully defined the exact GitHub repository constraints, I investigated the actual live state of the IAM role in AWS using the CLI (`aws iam get-role`). 
3. **Identified the Drift:** I discovered that while my local repository code was correct, the infrastructure out in AWS hadn't organically received the update! The IAM role trust policy in the cloud was still explicitly tied to an older repository (`Dod-Level-CICD-Project`) instead of reflecting the newly deployed repository (`DoD-Level-CICD-Project-1`). AWS was denying the claim strictly as designed.
4. **Remediated Cloud Infrastructure:** I utilized the AWS CLI `update-assume-role-policy` sub-command to forcefully push my local, correct `trust-policy.json` to the live AWS IAM role, eliminating the configuration gap.

**Result:**
The IAM role was successfully updated to securely trust the GitHub Actions token from the new repository. The subsequent pipeline execution authenticated flawlessly without using long-lived secrets, resulting in a successful end-to-end GitOps deployment. This reinforced my understanding of troubleshooting Configuration Drift analysis (verifying cloud state vs local code definition).

---

## Scenario: EKS Cluster Access Denied (eks:DescribeCluster Unauthorized)

**Situation:**
During the GitHub Actions `cluster-bootstrap` workflow execution, the pipeline successfully authenticated via OIDC, but immediately failed during the `update-kubeconfig` step. The AWS CLI threw an `AccessDeniedException`, stating the assumed IAM role (`dod-ops-cluster-1-github-actions`) was not authorized to perform `eks:DescribeCluster`.

**Task:**
I needed to grant the CI/CD pipeline the precise permissions necessary to query the EKS cluster endpoint without violating the principle of least privilege.

**Action:**
Instead of haphazardly attaching full Administrator access to bypass the error, I took a methodical, least-privilege approach:
1. **Separation of Concerns Analysis:** I recognized that while the Trust Policy (OIDC) successfully allowed GitHub to assume the role, the role itself lacked an "Identity-Based Policy" defining what it could actually *do* within AWS.
2. **Auditing Role Policies:** Using the AWS CLI (`aws iam list-attached-role-policies` and `list-role-policies`), I verified that the newly provisioned role was completely empty and lacked any managed or inline permissions.
3. **Designing a Least-Privilege Policy:** I authored a targeted JSON policy document (`eks-policy.json`) scoped down to exactly one action: `eks:DescribeCluster`, explicitly restricting the Resource ARN strictly to the `dod-ops-cluster-1` EKS cluster.
4. **Policy Enforcement:** I executed `aws iam put-role-policy` to attach this surgical inline policy directly to the pipeline's IAM role, satisfying the exact dependency of the `update-kubeconfig` command.

**Result:**
The pipeline successfully fetched the kubeconfig and authenticated securely to the Kubernetes control plane. By resisting the urge to over-provision permissions, I maintained a strict security posture for the CI/CD role while elegantly resolving the deployment blocker.
