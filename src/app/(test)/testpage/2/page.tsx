"use client";

import * as React from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
type Item = {
  id: string;
  content: string;
};

type Column = {
  id: string;
  title: string;
  items: Item[];
};

export default function ResizableDragDropPanes() {
  const [columns, setColumns] = React.useState<Column[]>([
    {
      id: "column1",
      title: "To Do",
      items: [
        { id: "item1", content: "Task 1" },
        { id: "item2", content: "Task 2" },
      ],
    },
    {
      id: "column2",
      title: "In Progress",
      items: [{ id: "item3", content: "Task 3" }],
    },
    {
      id: "column3",
      title: "Done",
      items: [{ id: "item4", content: "Task 4" }],
    },
  ]);

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const { source, destination } = result;
    const sourceColumn = columns.find((col) => col.id === source.droppableId);
    const destColumn = columns.find(
      (col) => col.id === destination.droppableId,
    );

    if (sourceColumn && destColumn) {
      const sourceItems = [...sourceColumn.items];
      const destItems =
        source.droppableId === destination.droppableId
          ? sourceItems
          : [...destColumn.items];
      const [removed] = sourceItems.splice(source.index, 1);
      destItems.splice(destination.index, 0, removed);

      setColumns(
        columns.map((col) => {
          if (col.id === source.droppableId) {
            return { ...col, items: sourceItems };
          }
          if (col.id === destination.droppableId) {
            return { ...col, items: destItems };
          }
          return col;
        }),
      );
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="mx-auto h-[600px] w-full max-w-4xl overflow-hidden rounded-lg border bg-background shadow-lg">
        <PanelGroup direction="horizontal">
          {columns.map((column, index) => (
            <React.Fragment key={column.id}>
              {index > 0 && (
                <PanelResizeHandle className="w-1 bg-border transition-colors hover:bg-primary" />
              )}
              <Panel minSize={20}>
                <div className="flex h-full flex-col bg-card">
                  <h2 className="border-b p-4 text-lg font-semibold">
                    {column.title}
                  </h2>
                  <Droppable droppableId={column.id}>
                    {(provided) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className="flex-1 overflow-y-auto p-4"
                      >
                        {column.items.map((item, index) => (
                          <Draggable
                            key={item.id}
                            draggableId={item.id}
                            index={index}
                          >
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className="mb-2 rounded bg-background p-4 shadow"
                              >
                                {item.content}
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>
              </Panel>
            </React.Fragment>
          ))}
        </PanelGroup>
      </div>
    </DragDropContext>
  );
}
