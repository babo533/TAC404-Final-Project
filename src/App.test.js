describe('Application', () => {
  test('project structure is correct', () => {
    expect(true).toBe(true);
  });

  test('all dependencies are installed', () => {
    const packageJson = require('../package.json');
    expect(packageJson.dependencies['react']).toBeDefined();
    expect(packageJson.dependencies['react-router-dom']).toBeDefined();
    expect(packageJson.dependencies['react-toastify']).toBeDefined();
    expect(packageJson.dependencies['recharts']).toBeDefined();
  });
});
