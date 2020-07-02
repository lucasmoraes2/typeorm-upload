import { getRepository } from 'typeorm';

import Transaction from '../models/Transaction';
import Category from '../models/Category';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    const transactionRepository = getRepository(Transaction);
    const categoryRepository = getRepository(Category);

    const checkCategoryExists = await categoryRepository.findOne({
      where: { title: category },
    });

    if (!checkCategoryExists) {
      const createNewCategory = categoryRepository.create({
        title: category,
      });

      await categoryRepository.save(createNewCategory);

      const findNewCategory = await categoryRepository.findOne({
        where: { title: category },
      });

      const { id } = findNewCategory as Category;

      const transaction = transactionRepository.create({
        title,
        value,
        type,
        category_id: id,
      });

      await transactionRepository.save(transaction);

      return transaction;
    }

    const { id } = checkCategoryExists;

    const transaction = transactionRepository.create({
      title,
      value,
      type,
      category_id: id,
    });

    await transactionRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
