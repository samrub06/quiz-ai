const fetch = require('node-fetch');
const { streamQuizToRes } = require('./quizService');

jest.mock('node-fetch');

describe('streamQuizToRes', () => {
  it('should stream quiz questions to res', async () => {
    // Mock OpenAI streaming response
    const mockChunks = [
      Buffer.from('data: {"choices":[{"delta":{"content":"{\\"question\\":\\"Q1\\",\\"choices\\":[\\"A\\",\\"B\\"],\\"correctAnswer\\":\\"A\\",\\"explanation\\":\\"exp\\"}\\n"}}]}\n'),
      Buffer.from('data: [DONE]\n')
    ];
    const mockAsyncIterable = {
      [Symbol.asyncIterator]: function () {
        let i = 0;
        return {
          next: () =>
            i < mockChunks.length
              ? Promise.resolve({ value: mockChunks[i++], done: false })
              : Promise.resolve({ done: true })
        };
      }
    };
    fetch.mockResolvedValue({ body: mockAsyncIterable });

    // Mock res
    const res = {
      write: jest.fn(),
      end: jest.fn()
    };

    await streamQuizToRes({}, res);

    const writeCalls = res.write.mock.calls.map(call => call[0]);
    // Check that at least one call contains the question
    expect(writeCalls.some(call => call.includes('"question":"Q1"'))).toBe(true);

    // Check that res.end has been called
    expect(res.end).toHaveBeenCalled();
  });
}); 