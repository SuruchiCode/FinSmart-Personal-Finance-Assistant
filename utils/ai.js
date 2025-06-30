// Simple AI utility for expense classification and financial insights

// Expense categories
const ESSENTIAL_CATEGORIES = [
  'rent', 'mortgage', 'utilities', 'groceries', 'healthcare', 
  'insurance', 'education', 'transportation'
];

const DISCRETIONARY_CATEGORIES = [
  'dining', 'entertainment', 'shopping', 'travel', 'gifts', 
  'subscriptions', 'hobbies'
];

// Classify expense as need or want
exports.classifyExpense = (expense) => {
  const category = expense.category.toLowerCase();
  
  // Check if category is in essential categories
  if (ESSENTIAL_CATEGORIES.includes(category)) {
    return 'need';
  }
  
  // Check if category is in discretionary categories
  if (DISCRETIONARY_CATEGORIES.includes(category)) {
    return 'want';
  }
  
  // Default classification based on amount
  return expense.amount > 1000 ? 'want' : 'need';
};

// Generate spending insights
exports.generateSpendingInsights = (expenses, savingsGoals) => {
  const insights = [];
  
  if (!expenses || expenses.length === 0) {
    return insights;
  }
  
  // Calculate total expenses
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  
  // Group expenses by category
  const expensesByCategory = {};
  expenses.forEach(expense => {
    const category = expense.category.toLowerCase();
    if (!expensesByCategory[category]) {
      expensesByCategory[category] = 0;
    }
    expensesByCategory[category] += expense.amount;
  });
  
  // Find highest spending category
  let highestCategory = null;
  let highestAmount = 0;
  
  Object.entries(expensesByCategory).forEach(([category, amount]) => {
    if (amount > highestAmount) {
      highestCategory = category;
      highestAmount = amount;
    }
  });
  
  if (highestCategory) {
    const percentage = Math.round((highestAmount / totalExpenses) * 100);
    
    insights.push({
      type: 'warning',
      message: `Your highest spending category is ${highestCategory} at ${percentage}% of your total expenses.`,
      action: `Consider setting a budget for ${highestCategory} expenses.`
    });
  }
  
  // Check needs vs wants ratio
  const needsExpenses = expenses
    .filter(expense => expense.type === 'need')
    .reduce((sum, expense) => sum + expense.amount, 0);
  
  const wantsExpenses = expenses
    .filter(expense => expense.type === 'want')
    .reduce((sum, expense) => sum + expense.amount, 0);
  
  const needsPercentage = Math.round((needsExpenses / totalExpenses) * 100);
  const wantsPercentage = Math.round((wantsExpenses / totalExpenses) * 100);
  
  if (wantsPercentage > 30) {
    insights.push({
      type: 'warning',
      message: `Your 'wants' spending is ${wantsPercentage}% of your total expenses, which is higher than the recommended 30%.`,
      action: 'Try to reduce discretionary spending to improve your financial health.'
    });
  } else {
    insights.push({
      type: 'positive',
      message: `Your 'needs' vs 'wants' ratio is good at ${needsPercentage}% vs ${wantsPercentage}%.`,
      action: 'Keep up the good work!'
    });
  }
  
  // Check savings goals progress
  if (savingsGoals && savingsGoals.length > 0) {
    const totalTargetAmount = savingsGoals.reduce((sum, goal) => sum + goal.targetAmount, 0);
    const totalCurrentAmount = savingsGoals.reduce((sum, goal) => sum + goal.currentAmount, 0);
    const savingsProgress = Math.round((totalCurrentAmount / totalTargetAmount) * 100);
    
    if (savingsProgress < 50) {
      insights.push({
        type: 'warning',
        message: `You've only saved ${savingsProgress}% of your total savings goals.`,
        action: 'Consider increasing your savings rate to reach your goals faster.'
      });
    } else {
      insights.push({
        type: 'positive',
        message: `You've already saved ${savingsProgress}% of your total savings goals.`,
        action: 'Keep up the good work!'
      });
    }
  }
  
  return insights;
};

// Generate chat response
exports.generateChatResponse = (message) => {
  const lowerMessage = message.toLowerCase();
  
  // Greetings
  if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
    return 'Hello! I\'m your AI financial assistant. I can help with budgeting, saving, investing, debt management, and more. How can I assist you today?';
  }
  
  // Savings related queries
  if (lowerMessage.includes('save') || lowerMessage.includes('saving')) {
    if (lowerMessage.includes('how') || lowerMessage.includes('tips') || lowerMessage.includes('advice')) {
      return 'Here are some effective saving strategies:\n\n1. Follow the 50/30/20 rule: 50% for needs, 30% for wants, and 20% for savings\n2. Set up automatic transfers to a high-yield savings account\n3. Use the 24-hour rule for non-essential purchases\n4. Try no-spend days or weeks\n5. Track your expenses to identify areas where you can cut back\n\nWould you like more specific advice on any of these strategies?';
    }
    if (lowerMessage.includes('goal') || lowerMessage.includes('target')) {
      return 'Setting specific savings goals is a great approach! Consider these steps:\n\n1. Define a clear, measurable goal (e.g., ₹50,000 for emergency fund)\n2. Set a realistic timeline\n3. Break it down into smaller monthly or weekly targets\n4. Track your progress regularly\n5. Celebrate milestones to stay motivated\n\nOur app can help you set up and track these goals. Would you like to create a new savings goal now?';
    }
    return 'Saving money consistently is one of the most important financial habits. Our app can help you set savings goals, track your progress, and even suggest personalized saving challenges based on your spending patterns. Would you like to know more about any specific aspect of saving?';
  }
  
  // Budget related queries
  if (lowerMessage.includes('budget') || lowerMessage.includes('spending') || lowerMessage.includes('expense')) {
    if (lowerMessage.includes('track') || lowerMessage.includes('monitor')) {
      return 'Our app offers several ways to track your expenses:\n\n1. Automatic categorization of transactions as needs vs. wants\n2. Visual spending breakdowns by category\n3. Monthly spending reports and trends\n4. AI-powered insights on your spending patterns\n5. Customizable budget limits with alerts\n\nYou can start by adding your expenses in the Expenses section. Would you like me to guide you there?';
    }
    if (lowerMessage.includes('reduce') || lowerMessage.includes('cut') || lowerMessage.includes('lower')) {
      return 'Here are some effective ways to reduce your spending:\n\n1. Review subscriptions and cancel unused ones\n2. Meal plan and cook at home more often\n3. Use the 24-hour rule for non-essential purchases\n4. Look for better deals on recurring bills (phone, internet, insurance)\n5. Consider a "no-spend" challenge for a week\n\nOur AI can analyze your spending patterns and suggest personalized areas where you might be able to cut back. Would you like to see this analysis?';
    }
    return 'Creating a budget is the foundation of financial success. Our app helps you track expenses, categorize them as needs vs. wants, and provides AI-powered insights to help you make better financial decisions. Would you like some specific budgeting tips or help setting up your budget?';
  }
  
  // Investment related queries
  if (lowerMessage.includes('invest') || lowerMessage.includes('investment') || lowerMessage.includes('stock') || lowerMessage.includes('mutual fund')) {
    if (lowerMessage.includes('beginner') || lowerMessage.includes('start')) {
      return 'For beginners, here are some investment basics:\n\n1. Start with an emergency fund before investing\n2. Consider index funds or ETFs for diversification\n3. Look into tax-advantaged retirement accounts\n4. Invest regularly through SIPs (Systematic Investment Plans)\n5. Keep investment costs low\n\nRemember that all investments carry risk, and it\'s important to do your research or consult a financial advisor.';
    }
    return 'Investing is a powerful way to build wealth over time. While our app focuses on budgeting and saving, we can provide general investment education and help you set aside money for your investment goals. For specific investment advice, we recommend consulting with a qualified financial advisor.';
  }
  
  // Debt related queries
  if (lowerMessage.includes('debt') || lowerMessage.includes('loan') || lowerMessage.includes('credit')) {
    if (lowerMessage.includes('pay off') || lowerMessage.includes('reduce')) {
      return 'Here are effective debt repayment strategies:\n\n1. Avalanche Method: Pay off highest-interest debt first\n2. Snowball Method: Pay off smallest debts first for psychological wins\n3. Debt consolidation: Combine multiple debts into one with a lower interest rate\n4. Consider balance transfer offers for credit card debt\n5. Automate payments to avoid missed payments\n\nWhich approach sounds most appealing to you?';
    }
    return 'Managing debt effectively is crucial for financial health. Focus on high-interest debt first, make all minimum payments on time, and consider strategies like the debt avalanche or debt snowball methods. Our app can help you track your debt payoff progress and integrate it with your overall financial plan.';
  }
  
  // Default response
  return 'Thank you for your message. As your AI financial assistant, I can help with budgeting, saving, debt management, and general financial education. Could you provide more details about what specific financial topic you\'d like assistance with?';
};
