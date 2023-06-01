import { useEffect, useMemo, useState } from "react";
import { AxiosResponse } from "axios";
import * as Accordion from "@radix-ui/react-accordion";
import restClient from "@utils/restClient.ts";
import { Group, Task } from "@types";
import arrowDown from "@assets/arrow-line-down.svg";
import list from "@assets/list.svg";
import listCompleted from "@assets/list-completed.svg";
import style from "@styles/app.module.scss";

interface FlagMap {
    [key: string]: boolean;
}

const App = () => {
    const [groups, setGroups] = useState<Group[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [accordionOpened, setAccordionOpened] = useState<FlagMap>({});

    const fetchData = () => {
        setLoading(true);
        restClient
            .get<{ data: Group[] }>(
                "/huvber/ba0d534f68e34f1be86d7fe7eff92c96/raw/98a91477905ea518222a6d88dd8b475328a632d3/mock-progress",
            )
            .then((response: AxiosResponse) => {
                // setTimeout was added to have a loader
                setTimeout(() => {
                    setGroups(response?.data);
                    setLoading(false);
                }, 500);
            });
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleTaskToggle = (groupId: string, taskId: string) => {
        setGroups((prevTasks) =>
            prevTasks.map((group: Group) => {
                if (group?.name === groupId) {
                    return {
                        ...group,
                        tasks: group?.tasks.map((task) => {
                            if (task?.description === taskId) {
                                return { ...task, checked: !task?.checked };
                            }
                            return task;
                        }),
                    };
                }

                return group;
            }),
        );
    };

    const totalSumOfTasksValues: number = useMemo(() => {
        if (!groups?.length) {
            return 0;
        }

        return groups.reduce((sum, group) => {
            const sumOfAllTaskValues = group?.tasks?.length
                ? group?.tasks.reduce((taskSum, task) => taskSum + task.value, 0)
                : 0;

            sum += sumOfAllTaskValues;

            return sum;
        }, 0);
    }, [groups]);

    const progress: string = useMemo(() => {
        const sumOfCheckedTasksValues: number = groups?.length
            ? groups.reduce((sum: number, group: Group) => {
                  const sumOfCheckedTasksValues = group?.tasks?.length
                      ? group.tasks.reduce((taskSum, task) => taskSum + (task.checked ? task.value : 0), 0)
                      : 0;

                  sum += sumOfCheckedTasksValues;

                  return sum;
              }, 0)
            : 0;

        if (sumOfCheckedTasksValues === 0 || totalSumOfTasksValues === 0) {
            return "0%";
        }

        return `${((sumOfCheckedTasksValues * 100) / totalSumOfTasksValues).toFixed(0) || 0}%`;
    }, [groups, totalSumOfTasksValues]);

    const isGroupCompleted = useMemo(() => {
        const groupCompletedMap: FlagMap = {};

        if (groups?.length) {
            groups.forEach((group) => {
                groupCompletedMap[group.name] = group.tasks.every((task: Task) => task.checked);
            });
        }

        return groupCompletedMap;
    }, [groups]);

    return (
        <div className={style.widget}>
            <div className={style.widget__header}>
                <h1 className={style["widget__header-title"]}>Lodgify Grouped Tasks</h1>
                {/* eslint-disable-next-line no-nested-ternary */}
                {loading ? (
                    "Loading..."
                ) : !groups?.length ? (
                    "No data"
                ) : (
                    <div className={style["widget__header-progress-bar-wrapper"]}>
                        <div className={style["widget__header-progress-bar"]} style={{ width: progress }}>
                            <p className={style["widget__header-progress-bar-value"]}>{progress}</p>
                        </div>
                    </div>
                )}
            </div>
            {!!groups.length && (
                <Accordion.Root type="multiple" className={style.widget__accordion}>
                    {groups.map((group: Group) => (
                        <Accordion.Item key={group.name} value={group.name} className={style["widget__accordion-item"]}>
                            <Accordion.Header className={style["widget__accordion-header"]} asChild>
                                <div>
                                    <Accordion.Trigger
                                        className={style["widget__accordion-trigger"]}
                                        onClick={() => {
                                            setAccordionOpened((prevState) => ({
                                                ...(prevState || {}),
                                                [group.name]: !prevState[group.name],
                                            }));
                                        }}
                                    >
                                        <p
                                            className={style["widget__accordion-header-label"]}
                                            style={{ color: isGroupCompleted?.[group.name] ? "#00B797" : "#333333" }}
                                        >
                                            <img
                                                className={style["widget__accordion-header-label-icon"]}
                                                src={isGroupCompleted?.[group.name] ? listCompleted : list}
                                                alt="list"
                                            />
                                            {group.name}
                                        </p>
                                        <div className={style["widget__accordion-arrow-wrapper"]}>
                                            <p className={style["widget__accordion-arrow-label"]} data-label="hide">
                                                {accordionOpened?.[group.name] ? "Hide" : "Show"}
                                            </p>
                                            <img
                                                src={arrowDown}
                                                alt="aroow-line-down"
                                                className={style["widget__accordion-arrow"]}
                                            />
                                        </div>
                                    </Accordion.Trigger>
                                </div>
                            </Accordion.Header>
                            <Accordion.Content className={style["widget__accordion-content"]}>
                                <div className={style["widget__accordion-task-wrapper"]}>
                                    {group.tasks.map((task) => (
                                        <div key={task.description} className={style["widget__accordion-task"]}>
                                            <input
                                                type="checkbox"
                                                checked={task.checked}
                                                className={style["widget__accordion-task-checkbox"]}
                                                onChange={() => handleTaskToggle(group.name, task.description)}
                                            />
                                            <p className={style["widget__accordion-task-description"]}>
                                                {task.description}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </Accordion.Content>
                        </Accordion.Item>
                    ))}
                </Accordion.Root>
            )}
        </div>
    );
};

export default App;
