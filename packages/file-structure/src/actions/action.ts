// Dependencies:
import { Request, Response } from 'express';
import { FileStructure } from '../structure/file-structure';

export type Action = (request: Request, response: Response) => Promise<void>;

export type ActionFactory = (fileStructure: FileStructure) => Action;
