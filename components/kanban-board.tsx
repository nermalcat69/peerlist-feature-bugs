import { useContext } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Post, statusEnum } from '@/db/schema';
import GlobalStoreContext from '@/store';

const statusColors = {
  backlog: 'bg-gray-100 dark:bg-gray-800',
  todo: 'bg-blue-50 dark:bg-blue-900',
  in_progress: 'bg-yellow-50 dark:bg-yellow-900',
  in_review: 'bg-purple-50 dark:bg-purple-900',
  done: 'bg-green-50 dark:bg-green-900',
  released: 'bg-pink-50 dark:bg-pink-900',
};

const statusNames = {
  backlog: 'Backlog',
  todo: 'To Do',
  in_progress: 'In Progress',
  in_review: 'In Review',
  done: 'Done',
  released: 'Released',
};

const KanbanCard = ({ post, index }: { post: Post; index: number }) => (
  <Draggable draggableId={post.id.toString()} index={index}>
    {(provided) => (
      <div
        ref={provided.innerRef}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
        className="p-4 mb-2 bg-white dark:bg-gray-800 rounded-lg shadow"
      >
        <div className="flex items-center justify-between mb-2">
          <span className={`text-sm px-2 py-1 rounded ${
            post.type === 'bug' ? 'bg-red-100 text-red-800' :
            post.type === 'feature' ? 'bg-blue-100 text-blue-800' :
            'bg-green-100 text-green-800'
          }`}>
            {post.type}
          </span>
          <span className={`text-sm px-2 py-1 rounded ${
            post.priority === 'urgent' ? 'bg-red-100 text-red-800' :
            post.priority === 'high' ? 'bg-orange-100 text-orange-800' :
            post.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
            'bg-green-100 text-green-800'
          }`}>
            {post.priority}
          </span>
        </div>
        <h3 className="font-semibold mb-2">{post.title}</h3>
        {post.images && post.images.length > 0 && (
          <div className="flex gap-2 mb-2">
            {post.images.map((image, i) => (
              <img
                key={i}
                src={image}
                alt={`Attachment ${i + 1}`}
                className="w-16 h-16 object-cover rounded"
              />
            ))}
          </div>
        )}
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>{post.userName}</span>
          <span>Votes: {post.votes}</span>
        </div>
      </div>
    )}
  </Draggable>
);

export default function KanbanBoard() {
  const { data, onUpdateStatus } = useContext(GlobalStoreContext);

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const { draggableId, destination } = result;
    const postId = parseInt(draggableId);
    const newStatus = destination.droppableId as typeof statusEnum.enumValues[number];

    onUpdateStatus(postId, newStatus);
  };

  const columns = Object.keys(statusNames).map(status => ({
    id: status,
    title: statusNames[status as keyof typeof statusNames],
    posts: data.filter(post => post.status === status),
  }));

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="flex gap-4 overflow-x-auto pb-4">
        {columns.map(column => (
          <div key={column.id} className="flex-shrink-0 w-80">
            <div className={`p-4 rounded-lg ${statusColors[column.id as keyof typeof statusColors]}`}>
              <h2 className="font-bold mb-4">
                {column.title} ({column.posts.length})
              </h2>
              <Droppable droppableId={column.id}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="min-h-[200px]"
                  >
                    {column.posts.map((post, index) => (
                      <KanbanCard key={post.id} post={post} index={index} />
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          </div>
        ))}
      </div>
    </DragDropContext>
  );
} 