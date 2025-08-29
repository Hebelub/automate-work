# Jira Integration with Task Manager

This task manager now includes powerful Jira integration that can automatically fetch task information and suggest task titles from Jira URLs.

## 🚀 **Features**

### **Automatic Jira Detection**
- **Task Information**: Shows Jira task summary, status, priority, and assignee
- **Smart Title Suggestions**: Automatically suggests using the Jira task summary as the task title
- **Real-time Updates**: Fetches current Jira task status and information
- **Visual Indicators**: Color-coded status badges and priority indicators

### **Automatic Task Title Updates**
- When you add a Jira link, the system automatically suggests using the Jira task summary as the task title
- Click on any task title to edit it manually
- Press Enter to save, Escape to cancel

## 📋 **Prerequisites**

### **1. Jira Account Access**
- You need access to a Jira instance (cloud or server)
- Your account must have permission to view the projects you want to access

### **2. API Token Generation**
1. Go to [Atlassian Account Settings](https://id.atlassian.com/manage-profile/security/api-tokens)
2. Click "Create API token"
3. Give it a label (e.g., "Task Manager Integration")
4. Copy the generated token

## 🔧 **Setup**

### **1. Environment Variables**
Create a `.env.local` file in your project root with the following variables:

```bash
# Jira Configuration
JIRA_DOMAIN=your-company.atlassian.net
JIRA_EMAIL=your-email@company.com
JIRA_API_TOKEN=your-jira-api-token
```

**Replace the values:**
- `JIRA_DOMAIN`: Your Jira instance domain (e.g., `company.atlassian.net` for cloud, `jira.company.com` for server)
- `JIRA_EMAIL`: The email address associated with your Jira account
- `JIRA_API_TOKEN`: The API token you generated in the prerequisites

### **2. Restart Development Server**
After adding the environment variables, restart your development server:
```bash
npm run dev
```

## 📱 **Usage**

### **Adding Jira Links**
1. **Click the + button** in any task's Links section
2. **Paste a Jira URL** (e.g., `https://company.atlassian.net/browse/PROJ-123`)
3. **Press Enter** to save
4. **Jira information loads automatically**
5. **Task title is automatically suggested** from the Jira task summary

### **Supported Jira URL Formats**
```
https://company.atlassian.net/browse/PROJ-123
https://company.atlassian.net/issues/PROJ-123
https://jira.company.com/browse/PROJ-123
https://jira.company.com/issues/PROJ-123
```

### **Editing Task Titles**
- **Click on any task title** to make it editable
- **Type your changes** and press Enter to save
- **Press Escape** to cancel changes
- **Click outside** the input field to save

## 🛠 **API Endpoints**

### **Jira Task Information**
```
GET /api/jira/task/{taskId}
```

**Response includes:**
- Task summary and description
- Current status and priority
- Assignee and reporter information
- Labels and project details
- Creation and update timestamps

## 🔒 **Security Considerations**

### **Authentication**
- Uses Basic Authentication with your email and API token
- API token is stored securely in environment variables
- No credentials are stored in your application code

### **Permissions**
- Only fetches information you have access to in Jira
- Respects Jira project and issue permissions
- No write access to Jira (read-only)

### **Rate Limiting**
- Jira has API rate limits
- Consider caching responses for frequently accessed data
- Monitor API usage in production

## 🚨 **Troubleshooting**

### **Common Issues**

#### **"Jira configuration missing"**
- Check that all environment variables are set in `.env.local`
- Restart your development server after adding environment variables

#### **"Jira task not found"**
- Verify the Jira URL is correct
- Check that you have access to the project/issue
- Ensure the task ID format is correct (e.g., PROJ-123)

#### **"Authentication failed"**
- Verify your email address is correct
- Check that your API token is valid and not expired
- Ensure your Jira account has the necessary permissions

#### **"API rate limit exceeded"**
- Too many requests to Jira API
- Wait for rate limit reset or implement caching

### **Debug Mode**
Enable debug logging by checking the browser console for detailed error messages.

## 📚 **Examples**

### **Example 1: Bug Report**
```
Jira URL: https://company.atlassian.net/browse/PROJ-456
Displays:
├── Summary: Fix login authentication bug
├── Key: PROJ-456
├── Status: In Progress
├── Priority: High
├── Assignee: John Doe
└── Labels: [bug, authentication, critical]
```

### **Example 2: Feature Request**
```
Jira URL: https://company.atlassian.net/browse/PROJ-789
Displays:
├── Summary: Add dark mode support
├── Key: PROJ-789
├── Status: Open
├── Priority: Medium
├── Reporter: Jane Smith
└── Labels: [enhancement, ui, user-experience]
```

## 🔮 **Future Enhancements**

### **Planned Features**
- **Issue Creation**: Create new Jira issues from the task manager
- **Status Updates**: Update Jira issue status from the task manager
- **Comment Integration**: View and add Jira comments
- **Workflow Integration**: Follow Jira workflow transitions
- **Time Tracking**: Log time against Jira issues

### **Customization Options**
- **Custom Fields**: Display custom Jira fields
- **Webhooks**: Real-time updates from Jira
- **Templates**: Custom display templates for different issue types

## 🤝 **Contributing**

To contribute to this Jira integration:

1. **Fork the repository**
2. **Create a feature branch**
3. **Add tests for new functionality**
4. **Submit a pull request**

## 📄 **License**

This Jira integration is part of the Task Manager project and follows the same license terms.

---

**Need Help?** Check the [Jira REST API documentation](https://developer.atlassian.com/cloud/jira/platform/rest/v3/) or open an issue in this repository.
