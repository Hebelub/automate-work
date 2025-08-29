# GitHub Integration with Task Manager

This task manager now includes powerful GitHub integration that can automatically fetch and display information from GitHub repositories, pull requests, and branches using the GitHub CLI.

## 🚀 **Features**

### **Automatic GitHub Detection**
- **Pull Requests**: Shows PR title, branch names, merge status, and review state
- **Branches**: Displays branch name, last commit message, and protection status
- **Repositories**: Shows repo description, default branch, stars, and forks
- **Smart Parsing**: Automatically detects GitHub URLs and extracts relevant information

### **Real-time Information**
- **Live Status**: PR merge status, review decisions, and CI/CD status
- **Branch Protection**: Shows if branches have required status checks
- **Commit History**: Displays recent commit information for branches

## 📋 **Prerequisites**

### **1. Install GitHub CLI**
```bash
# macOS
brew install gh

# Windows (with Chocolatey)
choco install gh

# Linux
curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | sudo dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | sudo tee /etc/apt/sources.list.d/github-cli.list > /dev/null
sudo apt update
sudo apt install gh
```

### **2. Authenticate with GitHub**
```bash
gh auth login
```

Follow the prompts to authenticate. You can choose:
- **HTTPS** (recommended for most users)
- **SSH** (if you use SSH keys)

### **3. Verify Installation**
```bash
gh --version
gh auth status
```

## 🔧 **Setup**

### **1. Environment Variables**
Create a `.env.local` file in your project root:
```bash
# Optional: Set GitHub token if you prefer token-based auth
GITHUB_TOKEN=your_github_token_here
```

### **2. Server Configuration**
The GitHub CLI commands run on your server, so ensure:
- GitHub CLI is installed on your server
- Server is authenticated with GitHub
- Proper permissions for the repositories you want to access

## 📱 **Usage**

### **Adding GitHub Links**
1. **Click the + button** in any task's Links section
2. **Paste a GitHub URL** (PR, branch, or repository)
3. **Press Enter** to save
4. **GitHub information loads automatically**

### **Supported URL Types**

#### **Pull Requests**
```
https://github.com/owner/repo/pull/123
```
**Displays:**
- PR title and number
- Source and target branches
- Merge status (Open/Merged/Closed)
- Review status and decisions

#### **Branches**
```
https://github.com/owner/repo/tree/branch-name
```
**Displays:**
- Branch name
- Last commit message
- Protection status

#### **Repositories**
```
https://github.com/owner/repo
```
**Displays:**
- Repository name and description
- Default branch
- Star and fork counts
- Repository visibility

## 🛠 **API Endpoints**

### **Pull Request Information**
```
GET /api/github/pr/{owner}/{repo}/{pr}
```

### **Repository Information**
```
GET /api/github/repo/{owner}/{repo}
```

### **Branch Information**
```
GET /api/github/branch/{owner}/{repo}/{branch}
```

## 🔒 **Security Considerations**

### **Authentication**
- GitHub CLI handles authentication securely
- No tokens stored in your application
- Uses your system's GitHub credentials

### **Rate Limiting**
- GitHub API has rate limits
- Consider caching responses for frequently accessed data
- Monitor API usage in production

### **Permissions**
- Ensure minimal required permissions
- Consider using GitHub Apps for production use
- Review repository access regularly

## 🚨 **Troubleshooting**

### **Common Issues**

#### **"gh: command not found"**
- GitHub CLI not installed
- Not in PATH
- **Solution**: Install GitHub CLI and restart terminal

#### **"Authentication required"**
- Not logged in to GitHub CLI
- **Solution**: Run `gh auth login`

#### **"Repository not found"**
- Repository doesn't exist
- No access to private repository
- **Solution**: Check repository name and permissions

#### **"API rate limit exceeded"**
- Too many requests to GitHub API
- **Solution**: Wait for rate limit reset or implement caching

### **Debug Mode**
Enable debug logging by setting environment variable:
```bash
DEBUG=github:*
```

## 🔮 **Future Enhancements**

### **Planned Features**
- **Issue Integration**: Fetch issue details and labels
- **Commit History**: Show recent commits for branches
- **Review Comments**: Display PR review comments
- **CI/CD Status**: Show GitHub Actions status
- **Notifications**: Alert on PR status changes

### **Customization Options**
- **Custom Fields**: Add custom metadata to GitHub items
- **Webhooks**: Real-time updates from GitHub
- **Templates**: Custom display templates for different GitHub types

## 📚 **Examples**

### **Example 1: Pull Request**
```
URL: https://github.com/microsoft/vscode/pull/12345
Displays:
├── Repo: microsoft/vscode
├── #12345: Add new feature for better debugging
├── Branch: feature/debug-enhancement
└── Status: Open
```

### **Example 2: Branch**
```
URL: https://github.com/facebook/react/tree/experimental
Displays:
├── Repo: facebook/react
├── Branch: experimental
└── Last commit: Add experimental hooks for concurrent features...
```

### **Example 3: Repository**
```
URL: https://github.com/vercel/next.js
Displays:
├── Repo: next.js
├── Description: The React Framework
├── Default: canary
├── ⭐ 100,000+
└── 🔀 20,000+
```

## 🤝 **Contributing**

To contribute to this GitHub integration:

1. **Fork the repository**
2. **Create a feature branch**
3. **Add tests for new functionality**
4. **Submit a pull request**

## 📄 **License**

This GitHub integration is part of the Task Manager project and follows the same license terms.

---

**Need Help?** Check the [GitHub CLI documentation](https://cli.github.com/) or open an issue in this repository.
