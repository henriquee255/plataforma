# 🧪 Test Examples - Practical Code Samples

> **Complete, runnable test examples for reference and copy-paste**

---

## 📁 Files in This Folder

### 1. useAdminData.test.example.js
**Size:** 19KB | **Lines:** 650+ | **Test Cases:** 30+

**What It Tests:**
- Custom hook for loading admin data
- API calls with fetch
- Cache management (localStorage + memory)
- Polling with timers
- Error handling
- Optimistic updates

**Key Patterns Demonstrated:**
```javascript
// Hook testing
const { result } = renderHook(() => useAdminData());

// Async data loading
await waitFor(() => {
  expect(result.current.loading).toBe(false);
});

// Fake timers for polling
vi.useFakeTimers();
vi.advanceTimersByTime(30000);

// Cache testing
localStorage.setItem('key', 'value');
expect(localStorage.getItem('key')).toBe('value');
```

**When to Use:**
- Testing custom hooks
- Testing data fetching
- Testing cache strategies
- Testing polling mechanisms

---

### 2. useUserManagement.test.example.js
**Size:** 21KB | **Lines:** 450+ | **Test Cases:** 25+

**What It Tests:**
- CRUD operations for users
- Form validation
- Filters and search
- Error handling by HTTP status
- Permission checks
- Toast notifications

**Key Patterns Demonstrated:**
```javascript
// CRUD operations
await result.current.createUser(newUser);
await result.current.updateUser(id, data);
await result.current.deleteUser(id);

// Validation
await expect(
  result.current.createUser({ email: 'invalid' })
).rejects.toThrow('Email inválido');

// HTTP error handling
global.fetch = vi.fn().mockResolvedValue({
  ok: false,
  status: 409,
  json: async () => ({ error: 'Email já existe' }),
});

// Filters
result.current.setFilters({ role: 'admin' });
expect(result.current.filteredUsers).toHaveLength(1);
```

**When to Use:**
- Testing CRUD hooks
- Testing form validation
- Testing filters/search
- Testing API error handling

---

### 3. user-crud-integration.test.example.jsx
**Size:** 19KB | **Lines:** 600+ | **Test Cases:** 15+

**What It Tests:**
- Complete user flow: Create → Edit → Delete
- Modal interactions
- Form submission
- Tab navigation
- Loading states
- Error states
- Success feedback

**Key Patterns Demonstrated:**
```javascript
// User interaction
const user = userEvent.setup();
await user.click(button);
await user.type(input, 'Text');

// Modal testing
const modal = screen.getByRole('dialog');
expect(modal).toBeInTheDocument();

await user.keyboard('{Escape}');
expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

// Waiting for async operations
await waitFor(() => {
  expect(screen.getByText(/sucesso/i)).toBeInTheDocument();
});

// Finding elements in modal
const modal = screen.getByRole('dialog');
const input = within(modal).getByLabelText(/nome/i);
```

**When to Use:**
- Testing complete user flows
- Testing modal interactions
- Testing form submissions
- Testing navigation

---

### 4. keyboard-navigation-accessibility.test.example.jsx
**Size:** 21KB | **Lines:** 700+ | **Test Cases:** 20+

**What It Tests:**
- Keyboard navigation (Tab, Shift+Tab)
- Activation keys (Enter, Space)
- Arrow key navigation
- ESC key functionality
- Focus trap in modals
- Focus visible indicators
- Skip links
- Jest Axe automated tests

**Key Patterns Demonstrated:**
```javascript
// Keyboard navigation
const user = userEvent.setup();
await user.tab(); // Tab forward
await user.tab({ shift: true }); // Shift+Tab backward

// Keyboard activation
await user.keyboard('{Enter}');
await user.keyboard('{Space}');
await user.keyboard('{Escape}');

// Arrow keys
await user.keyboard('{ArrowDown}');
await user.keyboard('{ArrowUp}');

// Focus assertions
expect(element).toHaveFocus();

// Jest Axe
import { axe, toHaveNoViolations } from 'jest-axe';
expect.extend(toHaveNoViolations);

const { container } = render(<Component />);
const results = await axe(container);
expect(results).toHaveNoViolations();
```

**When to Use:**
- Testing accessibility (WCAG 2.1 AA)
- Testing keyboard navigation
- Testing focus management
- Automated accessibility checks

---

## 🎯 How to Use These Examples

### 1. Copy-Paste Template

```javascript
// Copy the structure you need
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';

describe('MyHook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should do something', async () => {
    const { result } = renderHook(() => useMyHook());

    await waitFor(() => {
      expect(result.current.data).toBeDefined();
    });
  });
});
```

---

### 2. Adapt to Your Needs

**Example: Testing a different hook**

```javascript
// From useAdminData.test.example.js
const { result } = renderHook(() => useAdminData());

// Adapt to your hook
const { result } = renderHook(() => useMyCustomHook());
```

---

### 3. Learn Patterns

Each example demonstrates specific patterns:
- **useAdminData:** Async data loading, caching, polling
- **useUserManagement:** CRUD, validation, filtering
- **user-crud-integration:** User flows, modals, forms
- **keyboard-navigation:** Accessibility, keyboard, focus

Pick the pattern that matches your test case.

---

## 🔍 Quick Reference

### Mock fetch
```javascript
global.fetch = vi.fn().mockResolvedValue({
  ok: true,
  json: async () => ({ data: [] }),
});
```

### Render hook
```javascript
const { result } = renderHook(() => useMyHook());
```

### User event
```javascript
const user = userEvent.setup();
await user.click(button);
await user.type(input, 'text');
```

### Wait for async
```javascript
await waitFor(() => {
  expect(condition).toBe(true);
});
```

### Query elements
```javascript
const button = screen.getByRole('button', { name: /submit/i });
const modal = screen.getByRole('dialog');
const input = within(modal).getByLabelText(/email/i);
```

---

## 📚 Related Documentation

- **Strategy:** [../admin-testing-strategy.md](../admin-testing-strategy.md)
- **Guide:** [../QA-EXECUTION-GUIDE.md](../QA-EXECUTION-GUIDE.md)
- **Best Practices:** [../TESTING-BEST-PRACTICES.md](../TESTING-BEST-PRACTICES.md)
- **Cheatsheet:** [../TESTING-CHEATSHEET.md](../TESTING-CHEATSHEET.md)

---

## 💡 Tips

### Running Examples

These examples are **syntax-validated** but may need adjustments:
1. Import paths may need correction
2. Mock data may need to match your schema
3. Component/hook names may differ

### Common Patterns

**Pattern 1: Test a hook**
```javascript
const { result } = renderHook(() => useMyHook());
await waitFor(() => {
  expect(result.current.data).toBeDefined();
});
```

**Pattern 2: Test user interaction**
```javascript
const user = userEvent.setup();
render(<MyComponent />);
const button = screen.getByRole('button');
await user.click(button);
expect(screen.getByText('Success')).toBeInTheDocument();
```

**Pattern 3: Test modal**
```javascript
const modal = screen.getByRole('dialog');
expect(modal).toBeInTheDocument();
await user.keyboard('{Escape}');
await waitFor(() => {
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
});
```

**Pattern 4: Test accessibility**
```javascript
import { axe, toHaveNoViolations } from 'jest-axe';
expect.extend(toHaveNoViolations);

const { container } = render(<Component />);
const results = await axe(container);
expect(results).toHaveNoViolations();
```

---

## 🎓 Learning Path

1. **Start with:** useAdminData.test.example.js (hook basics)
2. **Then:** useUserManagement.test.example.js (CRUD operations)
3. **Then:** user-crud-integration.test.example.jsx (user flows)
4. **Finally:** keyboard-navigation-accessibility.test.example.jsx (accessibility)

---

**Total Examples:** 4 files
**Total Lines:** 2,400+
**Total Test Cases:** 90+
**Status:** ✅ Ready to use
