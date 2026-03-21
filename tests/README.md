# SimKaze 测试目录

## 测试结构

```
tests/
├── unit/           # 单元测试
├── integration/    # 集成测试
├── e2e/           # 端到端测试
├── fixtures/      # 测试数据
└── utils/         # 测试工具
```

## 运行测试

```bash
npm test              # 运行所有测试
npm run test:unit     # 仅单元测试
npm run test:e2e      # 仅E2E测试
```

## 测试框架

- Jest: 单元测试
- Supertest: API集成测试
- Playwright: E2E测试
