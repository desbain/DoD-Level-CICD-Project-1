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
