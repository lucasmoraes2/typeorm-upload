import { getRepository } from 'typeorm';
import AppError from '../errors/AppError';
import Transaction from '../models/Transaction';

class DeleteTransactionService {
  public async execute(id: string): Promise<void> {
    const transactionRepository = getRepository(Transaction);

    const transactionToRemove = await transactionRepository.findOne(id);

    if (!transactionToRemove) {
      throw new AppError('Transaction ID invalid.', 400);
    }

    await transactionRepository.remove(transactionToRemove);
  }
}

export default DeleteTransactionService;
