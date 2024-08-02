# todo-backend

## Description
Develop a smart to-do lists backend system. The system should allow tasks to be created, read, updated, and deleted. Implement logic for prioritizing tasks based on stated priority, handling task dependencies by ensuring that a task can only be completed if its dependencies are also completed, and preventing circular dependencies. Include a scheduling mechanism to assign start times to tasks, avoiding overlaps. Additionally, create a notification system to alert users about upcoming deadlines and completed dependencies. Ensure that edge cases related to data validation, scheduling conflicts, and notifications are properly handled.

## Model - Task
- **id**: (auto-generated)
- **title**: (string)
- **description**: (string)
- **priority**: (enum: LOW, MEDIUM, HIGH)
- **dueDate**: (datetime)
- **dependencies**: (array of task IDs)
- **status**: (enum: PENDING, IN_PROGRESS, COMPLETED)
- **createdAt**: (datetime)
- **updatedAt**: (datetime)

## Business Requirements

### Task Prioritization
- **Logic**: When a new task is created or an existing task is updated, re-calculate the priorities of all tasks based on:
  - User-defined priority
  - Due date proximity
  - Number of dependencies

### Task Dependencies
- **Logic**: Ensure that a task cannot be marked as COMPLETED unless all its dependencies are COMPLETED.
- **Validation**: When a task is created or updated, check for circular dependencies and reject the request if detected.

### Task Scheduling
- **Logic**: Implement a scheduling algorithm that assigns start times to tasks based on:
  - Task priorities
  - Dependencies
  - Estimated task durations (optional: you can add an estimatedDuration attribute to tasks)
- **Description**: Return a list of tasks with their assigned start and end times, ensuring no overlapping tasks for the same user.

### Notification System
- **Logic**: Send email or push notifications to users when:
  - A task is due in the next 24 hours.
  - A dependent task is marked as COMPLETED, informing users that the dependent task can now be started.

## Routes

- **Get all tasks**
  ```http
  GET /tasks
  ```

- **Create a new task**
  ```http
  POST /tasks
  ```

- **Get a specific task by ID**
  ```http
  GET /tasks/:id
  ```

- **Update a specific task by ID**
  ```http
  PUT /tasks/:id
  ```

- **Delete a specific task by ID**
  ```http
  DELETE /tasks/:id
  ```

- **Get the scheduled tasks with start and end times**
  ```http
  GET /tasks/schedule
  ```

