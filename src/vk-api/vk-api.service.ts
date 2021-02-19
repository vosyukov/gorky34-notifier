import fetch from 'node-fetch';
import { Injectable } from '@nestjs/common';
import { VK_ACCESS_TOKEN, VK_GROUP_ID } from './../env';

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
      group_id: VK_GROUP_ID,
      topic_id: topicId,
      from_group: '1',
      guid: Date.now().toString(),
    });
  }

  public async getGroupManagers(): Promise<Manager[]> {
    const { items } = await this.sendRequest('groups.getMembers', {
      group_id: VK_GROUP_ID,
      filter: 'managers',
    });

    return items;
  }

  public async getComments(topicId: number): Promise<Comment[]> {
    const { items } = await this.sendRequest('board.getComments', {
      group_id: VK_GROUP_ID,
      topic_id: String(topicId),
      sort: 'asc',
    });

    return items;
  }

  public async getFirstComments(topicId: number): Promise<Comment> {
    const { items } = await this.sendRequest('board.getComments', {
      group_id: VK_GROUP_ID,
      topic_id: String(topicId),
      sort: 'asc',
    });

    return items[0];
  }

  public async createTopic(title: string, text: string): Promise<number> {
    const topicId = await this.sendRequest('board.addTopic', {
      group_id: VK_GROUP_ID,
      title,
      text,
      from_group: '1',
    });

    return topicId;
  }

  public editTopic(topicId: number, title: string): Promise<void> {
    return this.sendRequest('board.editTopic', {
      group_id: VK_GROUP_ID,
      topic_id: String(topicId),
      title,
    });
  }

  public async getTopics(): Promise<Topic[]> {
    const result: { items: Topic[] } = await this.sendRequest(
      'board.getTopics',
      {
        group_id: VK_GROUP_ID,
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
        `https://api.vk.com/method/${method}?${p}&access_token=${VK_ACCESS_TOKEN}&v=5.130`,
      ),
    );
    const response = await fetch(
      encodeURI(
        `https://api.vk.com/method/${method}?${p}&access_token=${VK_ACCESS_TOKEN}&v=5.130`,
      ),
    );

    const json = await response.json();
    return json.response;
  }
}
