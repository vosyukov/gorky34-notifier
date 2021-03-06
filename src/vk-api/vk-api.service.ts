import fetch from 'node-fetch';
import { Injectable } from '@nestjs/common';

const GROUP_ID = '170060235';

export interface Topic {
  id: number;
  title: string;
  created: number;
}

export interface Manager {
  id: number;
  role: string;
}

export interface Comment {
  id: number;
  from_id: number;
  date: number;
  text: string;
}

@Injectable()
export class VkApiService {
  public async createComment(topicId: string, text: string): Promise<void> {
    return this.sendRequest('board.createComment', {
      group_id: GROUP_ID,
      topic_id: topicId,
      from_group: '1',
      guid: Date.now().toString(),
    });
  }

  public async getGroupManagers(): Promise<Manager[]> {
    const { items } = await this.sendRequest('groups.getMembers', {
      group_id: GROUP_ID,
      filter: 'managers',
    });

    return items;
  }

  public async getComments(topicId: number): Promise<Comment[]> {
    const { items } = await this.sendRequest('board.getComments', {
      group_id: GROUP_ID,
      topic_id: String(topicId),
      sort: 'asc',
    });

    return items;
  }

  public async getFirstComments(topicId: number): Promise<Comment> {
    const { items } = await this.sendRequest('board.getComments', {
      group_id: GROUP_ID,
      topic_id: String(topicId),
      sort: 'asc',
    });

    return items[0];
  }

  public async createTopic(title: string, text: string): Promise<number> {
    const topicId = await this.sendRequest('board.addTopic', {
      group_id: GROUP_ID,
      title,
      text,
      from_group: '1',
    });

    return topicId;
  }

  public editTopic(topicId: number, title: string): Promise<void> {
    return this.sendRequest('board.editTopic', {
      group_id: GROUP_ID,
      topic_id: String(topicId),
      title,
    });
  }

  public async getTopics(): Promise<Topic[]> {
    const result: { items: Topic[] } = await this.sendRequest(
      'board.getTopics',
      {
        group_id: GROUP_ID,
        preview: '1',
      },
    );

    return result.items;
  }

  private async sendRequest(
    method: string,
    parameters: Record<string, string>,
  ): Promise<any> {
    const keys = Object.keys(parameters);
    const values = Object.values(parameters);

    const p = keys.map((key, index) => `${key}=${values[index]}&`).join('');
    console.log(
      encodeURI(
        `https://api.vk.com/method/${method}?${p}&access_token=caf3f07bf443a3812b025de9240480da20da1269c06c021f3c6094a5336f6cc6cd98206874a96a29684f1&v=5.130`,
      ),
    );
    const response = await fetch(
      encodeURI(
        `https://api.vk.com/method/${method}?${p}&access_token=caf3f07bf443a3812b025de9240480da20da1269c06c021f3c6094a5336f6cc6cd98206874a96a29684f1&v=5.130`,
      ),
    );

    const json = await response.json();
    return json.response;
  }
}
