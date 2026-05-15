export const buildCommentTree =
  (comments) => {
    const map = new Map();

    const roots = [];

    comments.forEach((c) => {
      map.set(
        c._id.toString(),
        {
          ...c,
          replies: [],
        }
      );
    });

    comments.forEach((c) => {
      if (c.parentComment) {
        const parent = map.get(
          c.parentComment.toString()
        );

        if (parent) {
          parent.replies.push(
            map.get(
              c._id.toString()
            )
          );
        }
      } else {
        roots.push(
          map.get(
            c._id.toString()
          )
        );
      }
    });

    return roots;
  };