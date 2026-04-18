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
