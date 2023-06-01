export interface Task {
    description: string;
    value: number;
    checked: boolean;
}

export interface Group {
    name: string;
    tasks: Task[];
}
