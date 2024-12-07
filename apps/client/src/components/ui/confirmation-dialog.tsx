import React from 'react';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
	DialogClose,
} from '@/components/ui/dialog';
import { Button } from './button';

interface Props {
	title: string;
	description: string;
	children: React.ReactNode;
	onConfirm: () => void;
}

export const DestructiveActionButton = ({ title, description, children, onConfirm }: Props) => {
	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button variant='destructive'>{children}</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{title}</DialogTitle>
					<DialogDescription>{description}</DialogDescription>
				</DialogHeader>
				<DialogFooter>
					<DialogClose asChild>
						<Button>Cancel</Button>
					</DialogClose>
					<Button
						variant='destructive'
						onClick={() => {
							onConfirm();
						}}
					>
						{children}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};
