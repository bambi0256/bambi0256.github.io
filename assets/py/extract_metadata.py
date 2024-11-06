import yaml
import os

def extract_metadata(file_path):
    with open(file_path, 'r', encoding='utf-8') as file:
        content = file.read()

    # YAML 프론트 매터를 추출
    metadata_start = content.find('---')
    metadata_end = content.find('---', metadata_start + 3)

    metadata = content[metadata_start + 3: metadata_end].strip()
    content_body = content[metadata_end + 3:].strip()

    metadata_dict = yaml.safe_load(metadata)
    return metadata_dict, content_body

if __name__ == "__main__":
    file_path = "path_to_file.md"
    metadata, body = extract_metadata(file_path)
    print(metadata)  # 메타데이터 출력
